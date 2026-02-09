import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { validateLeagueName } from "./validation";

const RESERVED_SLUGS = [
  "sign-in",
  "sign-up",
  "dashboard",
  "api",
  "admin",
  "settings",
  "auth",
  "login",
  "register",
  "logout",
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const createLeague = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    validateLeagueName(name);

    let slug = generateSlug(name);
    if (!slug) {
      slug = "league";
    }

    if (RESERVED_SLUGS.includes(slug)) {
      slug = `${slug}-league`;
    }

    // Ensure uniqueness
    const existing = await ctx.db
      .query("leagues")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const leagueId = await ctx.db.insert("leagues", {
      name,
      slug,
      adminId: userId,
      createdAt: Date.now(),
    });

    return { leagueId, slug };
  },
});

export const getLeagueBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("leagues")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getMyLeagues = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const leagues = await ctx.db
      .query("leagues")
      .withIndex("by_adminId", (q) => q.eq("adminId", userId))
      .collect();

    // Get team counts for each league
    const result = [];
    for (const league of leagues) {
      const teams = await ctx.db
        .query("teams")
        .withIndex("by_leagueId", (q) => q.eq("leagueId", league._id))
        .collect();
      result.push({
        ...league,
        teamCount: teams.length,
      });
    }

    return result;
  },
});

export const deleteLeague = mutation({
  args: { leagueId: v.id("leagues") },
  handler: async (ctx, { leagueId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const league = await ctx.db.get(leagueId);
    if (!league) {
      throw new Error("League not found");
    }
    if (league.adminId !== userId) {
      throw new Error("Not authorized");
    }

    // Cascade delete: teams and teamCountries
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_leagueId", (q) => q.eq("leagueId", leagueId))
      .collect();

    for (const team of teams) {
      const countries = await ctx.db
        .query("teamCountries")
        .withIndex("by_teamId", (q) => q.eq("teamId", team._id))
        .collect();
      for (const row of countries) {
        await ctx.db.delete(row._id);
      }
      await ctx.db.delete(team._id);
    }

    await ctx.db.delete(leagueId);
  },
});

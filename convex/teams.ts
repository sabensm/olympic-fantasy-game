import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

async function requireLeagueAdmin(
  ctx: MutationCtx,
  leagueId: Id<"leagues">
) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const league = await ctx.db.get(leagueId);
  if (!league) {
    throw new Error("League not found");
  }
  if (league.adminId !== userId) {
    throw new Error("Not authorized - you are not the admin of this league");
  }
  return { userId, league };
}

export const listTeams = query({
  args: { leagueId: v.id("leagues") },
  handler: async (ctx, { leagueId }) => {
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_leagueId", (q) => q.eq("leagueId", leagueId))
      .collect();
    const result = [];

    for (const team of teams) {
      const countries = await ctx.db
        .query("teamCountries")
        .withIndex("by_teamId", (q) => q.eq("teamId", team._id))
        .collect();

      result.push({
        ...team,
        countries,
      });
    }

    return result;
  },
});

export const addTeam = mutation({
  args: {
    leagueId: v.id("leagues"),
    name: v.string(),
    avatar: v.string(),
    members: v.array(v.string()),
    countries: v.array(
      v.object({
        countryCode: v.string(),
        countryName: v.string(),
        countryFlag: v.string(),
      })
    ),
  },
  handler: async (ctx, { leagueId, name, avatar, members, countries }) => {
    await requireLeagueAdmin(ctx, leagueId);

    const teamId = await ctx.db.insert("teams", {
      name,
      avatar,
      members,
      leagueId,
    });

    for (const country of countries) {
      await ctx.db.insert("teamCountries", {
        teamId,
        countryCode: country.countryCode,
        countryName: country.countryName,
        countryFlag: country.countryFlag,
      });
    }

    return teamId;
  },
});

export const updateTeam = mutation({
  args: {
    id: v.id("teams"),
    name: v.string(),
    avatar: v.string(),
    members: v.array(v.string()),
    countries: v.array(
      v.object({
        countryCode: v.string(),
        countryName: v.string(),
        countryFlag: v.string(),
      })
    ),
  },
  handler: async (ctx, { id, name, avatar, members, countries }) => {
    const team = await ctx.db.get(id);
    if (!team) {
      throw new Error("Team not found");
    }
    await requireLeagueAdmin(ctx, team.leagueId);

    await ctx.db.patch(id, { name, avatar, members });

    // Delete existing country rows
    const existing = await ctx.db
      .query("teamCountries")
      .withIndex("by_teamId", (q) => q.eq("teamId", id))
      .collect();
    for (const row of existing) {
      await ctx.db.delete(row._id);
    }

    // Insert new country rows
    for (const country of countries) {
      await ctx.db.insert("teamCountries", {
        teamId: id,
        countryCode: country.countryCode,
        countryName: country.countryName,
        countryFlag: country.countryFlag,
      });
    }
  },
});

export const deleteTeam = mutation({
  args: { id: v.id("teams") },
  handler: async (ctx, { id }) => {
    const team = await ctx.db.get(id);
    if (!team) {
      throw new Error("Team not found");
    }
    await requireLeagueAdmin(ctx, team.leagueId);

    // Delete country rows first
    const countries = await ctx.db
      .query("teamCountries")
      .withIndex("by_teamId", (q) => q.eq("teamId", id))
      .collect();
    for (const row of countries) {
      await ctx.db.delete(row._id);
    }

    await ctx.db.delete(id);
  },
});

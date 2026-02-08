import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  leagues: defineTable({
    name: v.string(),
    slug: v.string(),
    adminId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_adminId", ["adminId"]),

  medals: defineTable({
    country: v.string(),
    countryCode: v.string(),
    countryFlag: v.optional(v.string()),
    gold: v.number(),
    silver: v.number(),
    bronze: v.number(),
    total: v.number(),
    scrapedAt: v.number(),
  })
    .index("by_country", ["country"])
    .index("by_countryCode", ["countryCode"]),

  teams: defineTable({
    name: v.string(),
    avatar: v.string(),
    members: v.array(v.string()),
    leagueId: v.id("leagues"),
  }).index("by_leagueId", ["leagueId"]),

  teamCountries: defineTable({
    teamId: v.id("teams"),
    countryCode: v.string(),
    countryName: v.string(),
    countryFlag: v.string(),
  }).index("by_teamId", ["teamId"]),
});

import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertMedals = internalMutation({
  args: {
    records: v.array(
      v.object({
        country: v.string(),
        countryCode: v.string(),
        countryFlag: v.optional(v.string()),
        gold: v.number(),
        silver: v.number(),
        bronze: v.number(),
        total: v.number(),
      })
    ),
  },
  handler: async (ctx, { records }) => {
    // Guard: never wipe medal data with an empty scrape result
    if (records.length === 0) {
      console.warn("upsertMedals called with 0 records — skipping to protect existing data");
      return;
    }

    const existing = await ctx.db.query("medals").collect();

    // Guard: if we previously had data, don't replace with a suspiciously small result
    // (e.g., Wikipedia layout change caused partial parse)
    if (existing.length > 10 && records.length < existing.length * 0.5) {
      console.warn(
        `Scrape returned ${records.length} records but ${existing.length} exist — skipping suspicious result`
      );
      return;
    }

    // Delete all existing rows
    for (const row of existing) {
      await ctx.db.delete(row._id);
    }

    // Insert fresh data
    const scrapedAt = Date.now();
    for (const record of records) {
      await ctx.db.insert("medals", { ...record, scrapedAt });
    }
  },
});

export const getMedalTable = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("medals").collect();

    // Standard Olympic ordering: gold desc, then silver desc, then bronze desc
    rows.sort((a, b) => {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    });

    return rows;
  },
});

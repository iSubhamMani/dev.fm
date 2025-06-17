import { query } from "../_generated/server";
import { v } from "convex/values";

export const getPodcastById = query({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    return podcast;
  },
});

export const getAllDrafts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const drafts = await ctx.db
      .query("podcasts")
      .withIndex("by_status", (q) => q.eq("status", "draft"))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return drafts;
  },
});

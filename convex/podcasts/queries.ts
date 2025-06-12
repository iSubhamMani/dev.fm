import { query } from "../_generated/server";
import { v } from "convex/values";

export const getPodcastById = query({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    return podcast;
  },
});

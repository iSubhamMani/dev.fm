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

export const getLatestPublishedPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("podcasts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();
  },
});

export const getPublishedPodcastsByQuery = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("podcasts")
      .withSearchIndex("by_query", (q) =>
        q.search("title", args.query).eq("status", "published")
      )
      .take(10);
  },
});

export const getPublishedPodcastById = query({
  args: { podcastId: v.id("podcasts") },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    if (!podcast || podcast.status !== "published") {
      throw new Error("Podcast not found or not published");
    }
    return podcast;
  },
});

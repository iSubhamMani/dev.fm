import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createPodcast = mutation({
  args: {
    title: v.optional(v.string()),
    idea: v.string(),
    threadId: v.optional(v.string()),
    userId: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    script: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newPodcastId = await ctx.db.insert("podcasts", {
      title: args.title,
      idea: args.idea,
      threadId: args.threadId,
      userId: args.userId,
      status: args.status || "draft",
      script: args.script,
      audioUrl: args.audioUrl,
      scriptGenerated: false, // Default to false when creating a new podcast
    });
    return newPodcastId;
  },
});

export const updatePodcast = mutation({
  args: {
    id: v.id("podcasts"),
    title: v.optional(v.string()),
    idea: v.optional(v.string()),
    threadId: v.optional(v.string()),
    userId: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    script: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Build the update object with only provided fields
    const update: Record<string, unknown> = {};
    if (args.title !== undefined) update.title = args.title;
    if (args.idea !== undefined) update.idea = args.idea;
    if (args.threadId !== undefined) update.threadId = args.threadId;
    if (args.userId !== undefined) update.userId = args.userId;
    if (args.status !== undefined) update.status = args.status;
    if (args.script !== undefined) update.script = args.script;
    if (args.audioUrl !== undefined) update.audioUrl = args.audioUrl;

    const updatedPodcast = await ctx.db.patch(args.id, update);
    return updatedPodcast;
  },
});

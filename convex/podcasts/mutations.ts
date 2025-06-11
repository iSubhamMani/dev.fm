import { mutation } from "../_generated/server";
import { v } from "convex/values";

const podcast = {
  title: v.optional(v.string()),
  idea: v.string(),
  threadId: v.optional(v.string()),
  userId: v.string(),
  status: v.union(
    v.literal("draft"),
    v.literal("scriptGenerated"),
    v.literal("audioGenerated"),
    v.literal("published")
  ),
  script: v.optional(v.string()),
  audioUrl: v.optional(v.string()),
};

export const createPodcast = mutation({
  args: { ...podcast },
  handler: async (ctx, args) => {
    const newPodcastId = await ctx.db.insert("podcasts", {
      title: args.title,
      idea: args.idea,
      threadId: args.threadId,
      userId: args.userId,
      status: args.status || "draft",
      script: args.script,
      audioUrl: args.audioUrl,
    });
    return newPodcastId;
  },
});

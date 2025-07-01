import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createPodcast = mutation({
  args: {
    title: v.optional(v.string()),
    idea: v.string(),
    threadId: v.optional(v.string()),
    userId: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    episodes: v.optional(
      v.array(
        v.object({
          episode: v.number(),
          title: v.string(),
          script: v.string(),
          audio: v.optional(
            v.object({
              url: v.string(),
              duration: v.number(),
            })
          ),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const newPodcastId = await ctx.db.insert("podcasts", {
      title: args.title,
      idea: args.idea,
      threadId: args.threadId,
      userId: args.userId,
      status: args.status || "draft",
      episodes: args.episodes,
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
    episodes: v.optional(
      v.array(
        v.object({
          episode: v.number(),
          title: v.string(),
          script: v.string(),
          audio: v.optional(
            v.object({
              url: v.string(),
              duration: v.number(),
            })
          ),
        })
      )
    ),
    scriptGenerated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Build the update object with only provided fields
    const update: Record<string, unknown> = {};
    if (args.title !== undefined) update.title = args.title;
    if (args.idea !== undefined) update.idea = args.idea;
    if (args.threadId !== undefined) update.threadId = args.threadId;
    if (args.userId !== undefined) update.userId = args.userId;
    if (args.status !== undefined) update.status = args.status;
    if (args.episodes !== undefined) update.episodes = args.episodes;
    if (args.scriptGenerated !== undefined) {
      update.scriptGenerated = args.scriptGenerated;
    }
    update.updatedAt = new Date().toISOString();

    const updatedPodcast = await ctx.db.patch(args.id, update);
    return updatedPodcast;
  },
});

export const saveAudio = mutation({
  args: {
    podcastId: v.id("podcasts"),
    episode: v.number(),
    audio: v.object({
      url: v.string(),
      duration: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    if (!podcast || !podcast.episodes) throw new Error("Podcast not found");

    const updatedEpisodes = podcast.episodes.map((ep) =>
      ep.episode === args.episode ? { ...ep, audio: args.audio } : ep
    );

    await ctx.db.patch(args.podcastId, { episodes: updatedEpisodes });
    return { success: true, message: "Audio URL saved successfully" };
  },
});

export const publishPodcast = mutation({
  args: {
    podcastId: v.id("podcasts"),
    title: v.string(),
    description: v.string(),
    episodeTitles: v.array(
      v.object({
        episode: v.number(),
        title: v.string(),
      })
    ),
    coverImage: v.string(),
    status: v.literal("published"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.podcastId);
    if (!podcast) throw new Error("Podcast not found");

    // Update the podcast with the provided details
    const updatedPodcast = {
      ...podcast,
      title: args.title,
      description: args.description,
      episodes: args.episodeTitles.map((et) => ({
        episode: et.episode,
        title: et.title,
        script:
          podcast.episodes?.find((ep) => ep.episode === et.episode)?.script ||
          "",
        audio: podcast.episodes?.find((ep) => ep.episode === et.episode)
          ?.audio || { url: "", duration: 0 },
      })),
      coverImage: args.coverImage,
      status: args.status,
      updatedAt: new Date().toISOString(),
    };

    await ctx.db.patch(args.podcastId, updatedPodcast);
    return { success: true, message: "Podcast published successfully" };
  },
});

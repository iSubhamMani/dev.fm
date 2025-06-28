import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";
import { Id } from "../_generated/dataModel";

type PodcastType = {
  _id: Id<"podcasts">;
  _creationTime: number;
  title?: string | undefined;
  threadId?: string | undefined;
  scriptGenerated?: boolean | undefined;
  episodes?:
    | {
        episode: number;
        title: string;
        script: string;
        audioUrl?: string | undefined;
      }[]
    | undefined;
  updatedAt?: string | undefined;
  idea: string;
  userId: string;
  status: "draft" | "published";
};

export const fetchPodcast = action({
  args: {
    podcastId: v.id("podcasts"),
  },
  handler: async (ctx, args): Promise<PodcastType | null> => {
    const podcast = await ctx.runQuery(api.podcasts.queries.getPodcastById, {
      podcastId: args.podcastId,
    });
    return podcast;
  },
});

export const createPodcastAction = action({
  args: {
    userId: v.string(),
    title: v.optional(v.string()),
    idea: v.string(),
    threadId: v.optional(v.string()),

    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    episodes: v.optional(
      v.array(
        v.object({
          episode: v.number(),
          title: v.string(),
          script: v.string(),
          audioUrl: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const res = await fetch(`https://api.github.com/user/${args.userId}`);
    if (!res.ok) throw new Error("User not found");
    const userData = await res.json();

    const newPodcastId = (await ctx.runMutation(
      api.podcasts.mutations.createPodcast,
      {
        title: args.title,
        idea: args.idea,
        threadId: args.threadId,
        userId: userData.login,
        status: args.status || "draft",
        episodes: args.episodes,
      }
    )) as Id<"podcasts">;

    return newPodcastId;
  },
});

export const getSearchResults = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const results = (await ctx.runQuery(
      api.podcasts.queries.getPublishedPodcastsByQuery,
      {
        query: args.query,
      }
    )) as PodcastType[];
    return results;
  },
});

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

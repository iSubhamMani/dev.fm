import { z } from "zod";
import { Agent } from "@convex-dev/agent";
import { api, components } from "./_generated/api";
import { tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { v } from "convex/values";
import { action } from "../convex/_generated/server";
import { Id } from "./_generated/dataModel";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || "",
});

const scriptAgentSystemPrompt = `
You are a podcast scriptwriting assistant for developers.

You will receive user input containing either of them:
1. A new podcast idea (to generate the full multi-episode script),
2. A request to modify existing script, episode contents or add new episodes,

When generating the full podcast script:
- Analyze the user's idea.
- Break it into logical episodes if needed (if not mentioned, assume only 1 episode).
- Return the output as a JSON object with an array "episodes".
- The "episodes" array must contain objects with:
  - "episode": The episode number (starting from 1)
  - "title": The episode title
  - "script": The episode script
- If the user provides a title, use it; otherwise, generate a descriptive title.

When revising or adding new episodes:
- Identify the episodes to update or add based on the user's request.
- Return only the modified or new episodes in the "episodes" array.
- Each episode object should have the same structure as above.

If there is a requirement to delete one or multiple episodes:
- Include a "delete" field in the object with the episode numbers to be deleted.

In all cases, also return:
- An "explanation" field that briefly summarizes what you changed or created.

Use the generateScriptTool to return the result. Do not return anything outside of the tool result.
`;

const generateScriptTool = tool({
  description: "Generates or modifies a podcast script based on user input.",
  parameters: z.object({
    episodes: z
      .array(
        z.object({
          episode: z.number(),
          title: z.string(),
          script: z.string(),
        })
      )
      .optional(),
    delete: z.optional(z.array(z.number())),
    explanation: z.string(),
  }),
  execute: async (args) => {
    return args;
  },
});

const scriptGenerationAgent = new Agent(components.agent, {
  chat: google("gemini-2.0-flash"),
  instructions: scriptAgentSystemPrompt,
  tools: { generateScriptTool },
});

export const createScriptAgentThread = action({
  args: {
    prompt: v.string(),
    userId: v.string(),
    threadId: v.optional(v.string()),
    podcastId: v.optional(v.id("podcasts")),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    scriptGenerated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let thread;
    let threadId = args.threadId;

    if (!threadId) {
      const result = await scriptGenerationAgent.createThread(ctx, {
        userId: args.userId,
      });
      thread = result.thread;
      threadId = result.threadId;
    } else {
      const result = await scriptGenerationAgent.continueThread(ctx, {
        threadId: threadId,
        userId: args.userId,
      });
      thread = result.thread;
    }

    const result = await thread.generateText({
      prompt: args.prompt,
    });

    const newEpisodes = result?.toolResults?.[0]?.result?.episodes;

    if (newEpisodes) {
      const podcast = await ctx.runQuery(api.podcasts.queries.getPodcastById, {
        podcastId: args.podcastId as Id<"podcasts">,
      });

      const existingEpisodes = podcast?.script?.episodes ?? [];

      // Handle deletions if present
      const episodesToDelete: number[] =
        result?.toolResults?.[0]?.result?.delete ?? [];
      const filteredEpisodes = existingEpisodes.filter(
        (e) => !episodesToDelete.includes(e.episode)
      );

      // Merge new/updated episodes
      const mergedEpisodes = [
        ...filteredEpisodes.filter(
          (e) => !newEpisodes.find((n) => n.episode === e.episode)
        ),
        ...newEpisodes, // overwrite matching keys
      ];

      await ctx.runMutation(api.podcasts.mutations.updatePodcast, {
        id: args.podcastId as Id<"podcasts">,
        script: { episodes: mergedEpisodes },
        status: args.status || "draft",
        threadId: threadId,
        scriptGenerated: args.scriptGenerated || true,
      });
    }

    return {
      threadId,
      text: result?.text,
      toolResults: result?.toolResults?.[0]?.result,
    };
  },
});

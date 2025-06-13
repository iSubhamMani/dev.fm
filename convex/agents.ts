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

    Your task is to generate or update a podcast script based on user instructions. Always return:
    1. The updated full podcast script
    2. A brief, natural explanation of what changes you made — e.g., what section you expanded, reworded, or added.

    Return your result using the generateScriptTool with both "script" and "explanation" fields. Do not return anything else outside the tool.
`;

const generateScriptTool = tool({
  description:
    "Generate or update a podcast script based on user instructions.",
  parameters: z.object({
    script: z.string(),
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
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("scriptGenerated"),
        v.literal("audioGenerated"),
        v.literal("published")
      )
    ),
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

    await ctx.runMutation(api.podcasts.mutations.updatePodcast, {
      id: args.podcastId as Id<"podcasts">,
      script: result?.toolResults?.[0]?.result?.script,
      status: args.status || "scriptGenerated",
      threadId: threadId,
    });

    return {
      threadId,
      text: result?.text,
      toolResults: result?.toolResults?.[0]?.result,
    };
  },
});

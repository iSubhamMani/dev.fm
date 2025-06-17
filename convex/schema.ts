import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...
  podcasts: defineTable({
    title: v.optional(v.string()),
    idea: v.string(),
    threadId: v.optional(v.string()),
    userId: v.string(),
    status: v.union(v.literal("draft"), v.literal("published")),
    scriptGenerated: v.optional(v.boolean()),
    script: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
  }).index("by_status", ["status"]),
});

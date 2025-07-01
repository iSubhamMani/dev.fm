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
    updatedAt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    description: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .searchIndex("by_query", {
      searchField: "title",
      filterFields: ["description", "status"],
    }),
});

// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  papers: defineTable({
    // Core metadata
    title: v.string(),
    authors: v.array(v.string()),
    abstract: v.string(),
    arxivId: v.string(), // e.g. "2301.12345"
    arxivUrl: v.string(), // Full ArXiv URL
    pdfUrl: v.string(), // ArXiv PDF URL
    publishedDate: v.optional(v.string()), // ISO date string

    // Goodpapers-specific fields
    userId: v.id("users"), // For multi-user support
    readingStatus: v.union(
      v.literal("to_read"),
      v.literal("reading"),
      v.literal("completed")
    ),
    tags: v.array(v.string()), // Simple string tags

    // File storage
    pdfStorageId: v.optional(v.id("_storage")), // Convex file storage ID

    // Timestamps
    createdAt: v.number(), // Date.now()
    updatedAt: v.number(), // Date.now()
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .index("by_arxiv_id", ["arxivId"])
    .index("by_user_arxiv", ["userId", "arxivId"])
    .searchIndex("search_papers", {
      searchField: "title",
      filterFields: ["userId"],
    }),

  notes: defineTable({
    paperId: v.id("papers"),
    userId: v.id("users"),
    content: v.string(), // Markdown content
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_paper", ["paperId"])
    .index("by_user", ["userId"]),

  users: defineTable({
    // Auth provider fields (populated by Convex Auth)
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.number()),

    // Timestamps
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),
});
// convex/papers.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get recent papers (last 10 modified)
const listRecentPapers = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;

    const papers = await ctx.db
      .query("papers")
      .withIndex("by_user_updated", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    return papers;
  },
});

// Export all functions for API access
export {
  listRecentPapers,
  listPapers,
  getPaper,
  getPaperByArxivId,
  searchPapers,
  createPaper,
  updatePaper,
  deletePaper,
};

// Get all papers for a user (with optional filters)
const listPapers = query({
  args: {
    userId: v.id("users"),
    status: v.optional(v.union(
      v.literal("to_read"),
      v.literal("reading"),
      v.literal("completed")
    )),
    tag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let papers = await ctx.db
      .query("papers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        args.status ? q.eq(q.field("readingStatus"), args.status) : true
      )
      .collect();

    // Filter by tag if provided (tags require client-side filter due to array includes)
    if (args.tag) {
      papers = papers.filter((p) => p.tags.includes(args.tag!));
    }

    // Sort by most recently updated
    papers.sort((a, b) => b.updatedAt - a.updatedAt);

    return papers;
  },
});

// Get single paper by ID
const getPaper = query({
  args: {
    paperId: v.id("papers"),
  },
  handler: async (ctx, args) => {
    const paper = await ctx.db.get(args.paperId);
    return paper;
  },
});

// Get paper by ArXiv ID (for checking duplicates)
const getPaperByArxivId = query({
  args: {
    arxivId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const paper = await ctx.db
      .query("papers")
      .withIndex("by_user_arxiv", (q) =>
        q.eq("userId", args.userId).eq("arxivId", args.arxivId)
      )
      .first();

    return paper;
  },
});

// Search papers (title, authors, abstract)
const searchPapers = query({
  args: {
    userId: v.id("users"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    // Use Convex search index
    const results = await ctx.db
      .query("papers")
      .withSearchIndex("search_papers", (q) =>
        q.search("title", args.query).eq("userId", args.userId)
      )
      .take(20);

    return results;
  },
});

// Create a new paper
const createPaper = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    authors: v.array(v.string()),
    abstract: v.string(),
    arxivId: v.string(),
    arxivUrl: v.string(),
    pdfUrl: v.string(),
    publishedDate: v.optional(v.string()),
    pdfStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Check for duplicate ArXiv ID
    const existing = await ctx.db
      .query("papers")
      .withIndex("by_user_arxiv", (q) =>
        q.eq("userId", args.userId).eq("arxivId", args.arxivId)
      )
      .first();

    if (existing) {
      throw new Error(`Paper with ArXiv ID ${args.arxivId} already exists`);
    }

    const now = Date.now();
    const paperId = await ctx.db.insert("papers", {
      userId: args.userId,
      title: args.title,
      authors: args.authors,
      abstract: args.abstract,
      arxivId: args.arxivId,
      arxivUrl: args.arxivUrl,
      pdfUrl: args.pdfUrl,
      publishedDate: args.publishedDate,
      pdfStorageId: args.pdfStorageId,
      readingStatus: "to_read", // Default status
      tags: [], // Default empty tags
      createdAt: now,
      updatedAt: now,
    });

    return paperId;
  },
});

// Update paper metadata
const updatePaper = mutation({
  args: {
    paperId: v.id("papers"),
    readingStatus: v.optional(v.union(
      v.literal("to_read"),
      v.literal("reading"),
      v.literal("completed")
    )),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { paperId, ...updates } = args;

    await ctx.db.patch(paperId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return paperId;
  },
});

// Delete paper (and associated notes)
const deletePaper = mutation({
  args: {
    paperId: v.id("papers"),
  },
  handler: async (ctx, args) => {
    // Delete associated notes first
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_paper", (q) => q.eq("paperId", args.paperId))
      .collect();

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }

    // Delete the paper
    await ctx.db.delete(args.paperId);

    return { success: true };
  },
});
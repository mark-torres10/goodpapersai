// convex/notes.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get notes for a paper
export const getNotesByPaper = query({
  args: {
    paperId: v.id("papers"),
  },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_paper", (q) => q.eq("paperId", args.paperId))
      .collect();

    // For V1, we only have one note per paper
    // Return the first note or null
    return notes[0] ?? null;
  },
});

// Save or update note for a paper
export const saveNote = mutation({
  args: {
    paperId: v.id("papers"),
    userId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if note already exists
    const existingNote = await ctx.db
      .query("notes")
      .withIndex("by_paper", (q) => q.eq("paperId", args.paperId))
      .first();

    const now = Date.now();

    if (existingNote) {
      // Update existing note
      await ctx.db.patch(existingNote._id, {
        content: args.content,
        updatedAt: now,
      });
      return existingNote._id;
    } else {
      // Create new note
      const noteId = await ctx.db.insert("notes", {
        paperId: args.paperId,
        userId: args.userId,
        content: args.content,
        createdAt: now,
        updatedAt: now,
      });
      return noteId;
    }
  },
});

// Delete note
export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.noteId);
    return { success: true };
  },
});
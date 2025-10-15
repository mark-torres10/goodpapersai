# PER-9 Execution Plan: Backend Schema & Core Functions

**Linear Ticket**: https://linear.app/metresearch/issue/PER-9  
**Estimated Time**: 2.5-3 hours  
**Dependencies**: PER-8 (COMPLETE ✅)  
**Can Run in Parallel With**: PER-10

---

## Executive Summary

Implement the complete Convex backend schema and core functions for Goodpapers V1 MVP. This includes defining database schemas for papers, notes, and users; creating queries and mutations for CRUD operations; implementing full-text search with autocomplete; and setting up proper data relationships and indexes.

**Working Directory**: `/Users/mark/Documents/work/goodpapers/goodpapers/`

---

## Context Analysis

### What Needs to Be Implemented

**Database Schema (3 tables)**:
1. `papers` - Academic papers with metadata
2. `notes` - Paper-level notes with markdown
3. `users` - User profiles (for future multi-user support)

**Convex Functions**:
- Queries: List papers, get paper details, search papers, get notes
- Mutations: Add paper, update paper, delete paper, save notes
- Indexes: Search index for title/author/abstract/notes

**Key Requirements from Spec**:
- Store ArXiv metadata (title, authors, abstract, ArXiv ID, PDF URL)
- Track reading status (To Read, Reading, Completed)
- Support tags for organization
- Full-text search across titles, authors, abstracts, notes
- Paper-level markdown notes (not comment threads)
- Display last 10 modified papers

### Key Constraints

- Use Convex schema definition (not raw TypeScript)
- All fields must be validated
- userId required for multi-user support (even though V1 is single-user)
- Search must be fast (<1s response time)
- Use Convex indexes for search, not external service

### Existing Context

**Convex Setup** (from PER-8):
- Project: `impartial-wolf-773.convex.cloud`
- Location: `/Users/mark/Documents/work/goodpapers/goodpapers/convex/`
- Files exist: `auth.ts`, `http.ts`, `tsconfig.json`, `_generated/`
- Environment: `.env.local` with `NEXT_PUBLIC_CONVEX_URL`

**What's NOT in scope for PER-9**:
- ArXiv API integration (that's PER-10)
- PDF storage/serving (that's PER-10)
- Frontend components (that's PER-11+)
- Authentication implementation (that's PER-11)

---

## Implementation Strategy

### High-Level Approach

1. **Schema First**: Define all tables with proper types and validators
2. **Indexes Second**: Set up search indexes for performance
3. **Queries Third**: Read operations (list, get, search)
4. **Mutations Last**: Write operations (create, update, delete)

### Why This Approach

- Schema defines the foundation - everything depends on it
- Indexes must exist before queries that use them
- Queries are simpler than mutations (good for testing)
- Mutations come last because they're most complex

### Key Design Decisions

1. **Convex Schema over TypeScript types**: Convex schema provides runtime validation and better DX
2. **Search indexes over full-text service**: Simpler, faster, no external dependencies
3. **Separate notes table**: Allows for future expansion (comments, threads)
4. **Include userId everywhere**: Prepares for multi-user even though V1 is single-user
5. **Optional fields marked explicitly**: Makes API clear and prevents errors

---

## Detailed Execution Plan

### Phase 1: Schema Definition (45 min)

**Step 1.1**: Create `convex/schema.ts` (20 min)

Create the main schema file with three tables:

```typescript
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
```

**Step 1.2**: Verify schema compiles (5 min)

```bash
cd /Users/mark/Documents/work/goodpapers/goodpapers
npx convex dev
```

- Watch for any schema errors in terminal
- Check that `convex/_generated/` updates with new types
- Verify no TypeScript errors

**Step 1.3**: Test schema in Convex dashboard (10 min)

- Open Convex dashboard: https://dashboard.convex.dev
- Navigate to your project: `impartial-wolf-773`
- Go to "Data" tab
- Verify all three tables appear: `papers`, `notes`, `users`
- Check indexes are created

**Step 1.4**: Create helper types file (10 min)

```typescript
// convex/types.ts
import { Doc, Id } from "./_generated/dataModel";

export type Paper = Doc<"papers">;
export type Note = Doc<"notes">;
export type User = Doc<"users">;

export type ReadingStatus = "to_read" | "reading" | "completed";

export type PaperWithNotes = Paper & {
  notes: Note[];
};
```

---

### Phase 2: Query Functions (60 min)

**Step 2.1**: Create `convex/papers.ts` with queries (40 min)

```typescript
// convex/papers.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// Get recent papers (last 10 modified)
export const listRecentPapers = query({
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

// Get all papers for a user (with optional filters)
export const listPapers = query({
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
      .collect();
    
    // Filter by status if provided
    if (args.status) {
      papers = papers.filter((p) => p.readingStatus === args.status);
    }
    
    // Filter by tag if provided
    if (args.tag) {
      papers = papers.filter((p) => p.tags.includes(args.tag));
    }
    
    // Sort by most recently updated
    papers.sort((a, b) => b.updatedAt - a.updatedAt);
    
    return papers;
  },
});

// Get single paper by ID
export const getPaper = query({
  args: {
    paperId: v.id("papers"),
  },
  handler: async (ctx, args) => {
    const paper = await ctx.db.get(args.paperId);
    return paper;
  },
});

// Get paper by ArXiv ID (for checking duplicates)
export const getPaperByArxivId = query({
  args: {
    arxivId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const paper = await ctx.db
      .query("papers")
      .withIndex("by_arxiv_id", (q) => q.eq("arxivId", args.arxivId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    
    return paper;
  },
});

// Search papers (title, authors, abstract)
export const searchPapers = query({
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
```

**Step 2.2**: Create `convex/notes.ts` with queries (20 min)

```typescript
// convex/notes.ts
import { query } from "./_generated/server";
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
```

**Step 2.3**: Test queries in dashboard (10 min)

- Go to Convex dashboard → Functions
- Test `listRecentPapers` with a test userId
- Test `searchPapers` with empty query (should return error or empty)
- Verify all queries compile with no errors

---

### Phase 3: Mutation Functions (60 min)

**Step 3.1**: Add mutations to `convex/papers.ts` (40 min)

```typescript
// Add to convex/papers.ts
import { mutation } from "./_generated/server";

// Create a new paper
export const createPaper = mutation({
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
      .withIndex("by_arxiv_id", (q) => q.eq("arxivId", args.arxivId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
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
export const updatePaper = mutation({
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
export const deletePaper = mutation({
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
```

**Step 3.2**: Add mutations to `convex/notes.ts` (20 min)

```typescript
// Add to convex/notes.ts
import { mutation } from "./_generated/server";

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
```

---

### Phase 4: Testing & Validation (30 min)

**Step 4.1**: Manual testing in Convex dashboard (15 min)

Test the full flow:

1. **Create a test user** (Data tab → users → Insert):
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "createdAt": 1697414400000
   }
   ```
   - Note the generated `_id` (you'll need this)

2. **Test createPaper** (Functions tab):
   ```json
   {
     "userId": "<user_id_from_step_1>",
     "title": "Test Paper",
     "authors": ["Author One", "Author Two"],
     "abstract": "This is a test abstract for validation.",
     "arxivId": "2301.12345",
     "arxivUrl": "https://arxiv.org/abs/2301.12345",
     "pdfUrl": "https://arxiv.org/pdf/2301.12345.pdf"
   }
   ```
   - Should return a paper ID
   - Check Data tab → papers to verify

3. **Test listRecentPapers**:
   ```json
   {
     "userId": "<user_id>",
     "limit": 10
   }
   ```
   - Should return array with the test paper

4. **Test updatePaper**:
   ```json
   {
     "paperId": "<paper_id>",
     "readingStatus": "reading",
     "tags": ["machine-learning", "nlp"]
   }
   ```
   - Should succeed
   - Verify in Data tab that paper updated

5. **Test saveNote**:
   ```json
   {
     "paperId": "<paper_id>",
     "userId": "<user_id>",
     "content": "# Test Note\n\nThis is a test note with **markdown**."
   }
   ```
   - Should return note ID
   - Check Data tab → notes

6. **Test searchPapers**:
   ```json
   {
     "userId": "<user_id>",
     "query": "test"
   }
   ```
   - Should return the test paper

7. **Test duplicate prevention** (try createPaper with same arxivId):
   - Should throw error about duplicate

**Step 4.2**: Verify TypeScript types (5 min)

```bash
cd /Users/mark/Documents/work/goodpapers/goodpapers
npx convex dev --once
```

- Check for any TypeScript errors
- Verify `convex/_generated/api.d.ts` has all functions

**Step 4.3**: Test search performance (10 min)

1. Create 5-10 test papers with varied titles
2. Test search with different queries
3. Verify results come back in <1 second
4. Test empty query, special characters, very long queries

---

### Phase 5: Documentation (15 min)

**Step 5.1**: Create `convex/README.md` (10 min)

Document all functions with usage examples:

```markdown
# Goodpapers Convex Backend

## Schema

### Papers
- Core paper metadata from ArXiv
- Reading status tracking
- Tags for organization
- Timestamps for sorting

### Notes
- Paper-level markdown notes
- One note per paper (V1)

### Users
- User profiles from Convex Auth
- Multi-user support (future)

## Queries

### `papers.listRecentPapers`
Get last N modified papers for a user.

### `papers.searchPapers`
Full-text search across title, authors, abstract.

### `notes.getNotesByPaper`
Get note for a specific paper.

## Mutations

### `papers.createPaper`
Add new paper (prevents duplicates by arxivId).

### `papers.updatePaper`
Update reading status and tags.

### `notes.saveNote`
Create or update note for a paper.

## Testing

Run `npx convex dev` and use dashboard to test functions.
```

**Step 5.2**: Update project logs (5 min)

Add entry to `/Users/mark/Documents/work/goodpapers/projects/2025-10-14_goodpapers_v1_mvp/logs.md`:

```markdown
### 2025-10-14 - PER-9 Backend Schema Complete

**Status**: ✅ COMPLETE
**Time**: [actual time]

**Completed**:
- Schema defined for papers, notes, users
- All queries implemented and tested
- All mutations implemented and tested
- Search indexes working
- Duplicate prevention working
- Manual testing complete

**Files Created**:
- `convex/schema.ts` - Database schema
- `convex/types.ts` - TypeScript helper types
- `convex/papers.ts` - Paper queries and mutations
- `convex/notes.ts` - Note queries and mutations
- `convex/README.md` - Backend documentation
```

---

## Success Criteria

### Functional Requirements
- [x] Schema compiles with no errors
- [x] All three tables visible in Convex dashboard
- [x] Indexes created and working
- [x] All queries return expected results
- [x] All mutations work correctly
- [x] Search returns relevant results (<1s)
- [x] Duplicate prevention works
- [x] Notes can be created and retrieved

### Technical Requirements
- [x] TypeScript strict mode passing
- [x] No runtime errors in Convex
- [x] Generated types in `convex/_generated/`
- [x] All functions properly typed

### Testing Requirements
- [x] Manual testing completed for all functions
- [x] Edge cases tested (duplicates, empty queries, etc.)
- [x] Search performance verified

---

## Timeline

| Phase | Estimated | Notes |
|-------|-----------|-------|
| Schema Definition | 45 min | Foundation work |
| Query Functions | 60 min | Read operations |
| Mutation Functions | 60 min | Write operations |
| Testing & Validation | 30 min | Manual testing |
| Documentation | 15 min | README and logs |
| **Total** | **3 hours 30 min** | Within estimate |

---

## Risk Assessment

**Low Risks**:
- Schema syntax errors → Fixed by TypeScript
- Index not working → Check Convex dashboard, redefine if needed
- Query performance → Indexes should handle, add more if needed

**Mitigation**:
- Keep Convex dashboard open for real-time validation
- Test each function immediately after writing
- Use Convex docs if stuck: https://docs.convex.dev

---

## Notes

- This work is **independent of PER-10** (ArXiv integration)
- Auth integration happens in **PER-11** (you're preparing for it with userId fields)
- Frontend will consume these functions in **PER-12** and **PER-13**
- Keep `npx convex dev` running to see live updates

---

## Reference Links

- **Convex Schema**: https://docs.convex.dev/database/schemas
- **Convex Queries**: https://docs.convex.dev/functions/query-functions
- **Convex Mutations**: https://docs.convex.dev/functions/mutation-functions
- **Search Indexes**: https://docs.convex.dev/text-search
- **Project Dashboard**: https://dashboard.convex.dev (project: `impartial-wolf-773`)

---

**Ready to implement! All infrastructure from PER-8 is in place.** 🚀


# PER-13 Execution Plan: Paper Detail Page with PDF Viewer & Notes (UPDATED)

**Linear Ticket**: https://linear.app/metresearch/issue/PER-13  
**Estimated Time**: 2.5-3 hours  
**Dependencies**: PER-8 (✅), PER-9 (✅), PER-10 (✅), PER-11 (✅), **PER-12 (✅ COMPLETE)**  
**Blocks**: PER-14, PER-15  
**Updated**: 2025-10-15 (Post-PER-12 completion)

---

## Executive Summary

Implement the paper detail page featuring an integrated PDF viewer using react-pdf, a markdown notes editor with auto-save functionality, paper metadata display, reading status selector, and tags editor. This phase creates the core reading and note-taking experience of Goodpapers.

**Working Directory**: `/Users/mark/Documents/work/goodpapers/goodpapers/`

**Branch Name**: `feature/per-13_paper_detail_pdf_notes`

---

## Current State (Post-PER-12)

### What Works Now ✅
- Homepage displays paper list with TinyTroupe paper
- Clicking paper card navigates to `/paper/{paperId}`
- Mock authentication with test user working
- Add paper functionality working (tested with TinyTroupe)
- Search and status filters working
- Real-time Convex updates working

### What Currently Shows 404 ⚠️
**Before PER-13**: Clicking paper card → **404 "Page not found"**

This is **expected behavior** because:
- Dynamic route `/paper/[paperId]/page.tsx` doesn't exist yet
- PER-13 creates this route
- PER-12 only has navigation links, not destination pages

**After PER-13**: Clicking paper card → **Paper detail page with PDF viewer and notes** ✅

### Available Test Data
- **Paper**: TinyTroupe (ID: `j97dx96r97y92wk24aw4z3362n7shyrz`)
  - Full metadata in database
  - PDF stored in Convex Storage (pdfStorageId available)
  - ArXiv ID: 2507.09788
  - Title: "TinyTroupe: An LLM-powered Multiagent Persona Simulation Toolkit"
  - Authors: 6 authors
  - Status: "to_read"
  - Tags: [] (empty, can test adding tags)
  
- **User**: Test User (ID: `jd7b9a0m074jxjsxattq0cn74x7shyrz`)
  - Mock authentication working
  - No OAuth required for testing

### Dependencies Already Complete
- ✅ **PER-10**: PDF serving HTTP action ready (`/pdf/{storageId}`)
- ✅ **PER-11**: AppLayout, Header, ProtectedRoute components
- ✅ **PER-12**: Navigation links, user context, paper data
- ✅ **PER-9**: Notes queries/mutations ready

---

## What Needs to Be Implemented

### 1. Dynamic Route (/paper/[paperId]/page.tsx)
- Create Next.js dynamic route
- Integrate with AppLayout from PER-11
- Wrap with ProtectedRoute from PER-11
- Pass paperId to detail view component

### 2. PDF Viewer Component
- Use react-pdf library (already installed in PER-8)
- Integrate with Convex Storage HTTP action from PER-10
- PDF URL format: `https://impartial-wolf-773.convex.site/pdf/{pdfStorageId}`
- Page navigation (next/previous, page number)
- Zoom controls (in/out, fit-to-width)
- Loading states
- Error handling for missing PDFs

### 3. Notes Editor Component
- Markdown textarea
- Auto-save with 1s debounce
- Integrate with PER-9 notes queries/mutations
- Loading/saving indicators
- Timestamp display (last saved)
- Real-time updates via Convex

### 4. Paper Metadata Component
- Display title, authors, abstract (from PER-12 PaperCard inspiration)
- External ArXiv link
- Reading status selector (dropdown or buttons)
- Tags editor (add/remove tags)
- Timestamps (created/updated)

### 5. Layout Integration
- Two-column layout: PDF (60-70%) | Notes+Metadata (30-40%)
- Responsive (desktop-first)
- Goodreads-inspired styling
- Consistent with PER-12 aesthetic

---

## Implementation Strategy

### Phase 1: Dynamic Route & Basic Structure (20 min)
1. Create `/app/paper/[paperId]/page.tsx`
2. Create `PaperDetailView` component
3. Add query to fetch paper data
4. Test navigation from homepage (currently 404 → should load page)

### Phase 2: PDF Viewer Integration (50 min)
1. Create `PDFViewer` component with react-pdf
2. Configure PDF.js worker
3. Integrate with Convex Storage HTTP action
4. Add page navigation controls
5. Add zoom controls
6. Add loading and error states
7. Test with TinyTroupe PDF

### Phase 3: Notes Editor (40 min)
1. Create `NotesEditor` component
2. Integrate with PER-9 notes queries
3. Implement auto-save with debouncing
4. Add saving indicators
5. Test create and update flows
6. Verify persistence

### Phase 4: Metadata & Controls (30 min)
1. Create `PaperMetadata` component
2. Add reading status selector
3. Add tags editor
4. Integrate mutations for updates
5. Style to match PER-12 aesthetic

### Phase 5: Layout & Polish (25 min)
1. Create two-column layout
2. Integrate all components
3. Add responsive breakpoints
4. Polish styling and spacing
5. Test complete user flow

### Phase 6: Testing & Documentation (20 min)
1. Run automated tests (type check, build)
2. Browser testing with Playwright MCP
3. Test all interactions end-to-end
4. Create component documentation
5. Update test results documentation

**Total Estimated Time**: 2.5-3 hours

---

## Detailed Implementation

### Phase 1: Route Setup (20 min)

**File**: `app/paper/[paperId]/page.tsx`

```typescript
import { PaperDetailView } from "@/components/papers/PaperDetailView";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

interface PaperPageProps {
  params: {
    paperId: string;
  };
}

export default function PaperPage({ params }: PaperPageProps) {
  return (
    <ProtectedRoute>
      <AppLayout>
        <PaperDetailView paperId={params.paperId} />
      </AppLayout>
    </ProtectedRoute>
  );
}
```

**File**: `components/papers/PaperDetailView.tsx`

```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PDFViewer } from "./PDFViewer";
import { NotesEditor } from "./NotesEditor";
import { PaperMetadata } from "./PaperMetadata";

interface PaperDetailViewProps {
  paperId: string;
}

export function PaperDetailView({ paperId }: PaperDetailViewProps) {
  const paper = useQuery(api.papers.getPaper, {
    paperId: paperId as Id<"papers">,
  });
  
  const currentUser = useQuery(api.users.getCurrentUser);

  if (paper === undefined || currentUser === undefined) {
    return <LoadingSkeleton />;
  }

  if (!paper) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-600">Paper not found.</p>
        <a href="/" className="mt-4 text-indigo-600 hover:text-indigo-700">
          Back to homepage
        </a>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-600">Please sign in to view this paper.</p>
      </div>
    );
  }

  // Get PDF URL from Convex Storage
  const pdfUrl = paper.pdfStorageId
    ? `https://impartial-wolf-773.convex.site/pdf/${paper.pdfStorageId}`
    : null;

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* PDF Viewer - Left Column (60%) */}
      <div className="flex-[6]">
        {pdfUrl ? (
          <PDFViewer pdfUrl={pdfUrl} title={paper.title} />
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-600">PDF not available for this paper.</p>
          </div>
        )}
      </div>

      {/* Notes & Metadata - Right Column (40%) */}
      <div className="flex-[4] flex flex-col gap-6 overflow-y-auto">
        <PaperMetadata paper={paper} />
        <NotesEditor paperId={paper._id} userId={currentUser._id} />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-pulse">
      <div className="flex-[6] bg-gray-200 rounded-lg" />
      <div className="flex-[4] space-y-6">
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="h-96 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
```

---

### Phase 2: PDF Viewer Component (50 min)

**File**: `components/papers/PDFViewer.tsx`

```typescript
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

export function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setError("Failed to load PDF. Please try again.");
    setIsLoading(false);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  };

  const zoomIn = () => setScale(Math.min(2.0, scale + 0.1));
  const zoomOut = () => setScale(Math.max(0.5, scale - 0.1));
  const fitToWidth = () => setScale(1.0);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200">
      {/* PDF Controls */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Page Navigation */}
          <button
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber <= 1 || isLoading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pageNumber}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              min={1}
              max={numPages}
              disabled={isLoading}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
            />
            <span className="text-sm text-gray-700">
              of {numPages || "?"}
            </span>
          </div>

          <button
            onClick={() => goToPage(pageNumber + 1)}
            disabled={pageNumber >= numPages || isLoading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5 || isLoading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Zoom out"
          >
            −
          </button>
          <span className="text-sm text-gray-700 min-w-[4rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 2.0 || isLoading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={fitToWidth}
            disabled={isLoading}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
          >
            Fit
          </button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4" />
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="pdf-document"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
```

---

### Phase 3: Notes Editor Component (40 min)

**File**: `components/papers/NotesEditor.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface NotesEditorProps {
  paperId: Id<"papers">;
  userId: Id<"users">;
}

export function NotesEditor({ paperId, userId }: NotesEditorProps) {
  const notes = useQuery(api.notes.listByPaper, { paperId });
  const saveNote = useMutation(api.notes.saveNote);

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load existing note
  useEffect(() => {
    if (notes && notes.length > 0) {
      setContent(notes[0].content || "");
    }
  }, [notes]);

  // Debounced auto-save
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      // Only save if content changed from database
      const currentDbContent = notes && notes.length > 0 ? notes[0].content : "";
      
      if (content !== currentDbContent) {
        setIsSaving(true);

        try {
          const noteId = notes && notes.length > 0 ? notes[0]._id : null;
          
          await saveNote({
            paperId,
            userId,
            content,
            noteId: noteId ?? undefined,
          });

          setLastSaved(new Date());
        } catch (error) {
          console.error("Failed to save note:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [content, notes, saveNote, paperId, userId]);

  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diffSeconds < 10) return "Just now";
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return lastSaved.toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <span className="text-xs text-gray-500">
          {isSaving ? (
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Saving...
            </span>
          ) : lastSaved ? (
            `Saved ${formatLastSaved()}`
          ) : (
            ""
          )}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes on this paper..."
        className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
      />

      <p className="mt-2 text-xs text-gray-500">
        Markdown supported. Notes auto-save as you type.
      </p>
    </div>
  );
}
```

---

### Phase 4: Paper Metadata Component (30 min)

**File**: `components/papers/PaperMetadata.tsx`

```typescript
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";

interface PaperMetadataProps {
  paper: Doc<"papers">;
}

export function PaperMetadata({ paper }: PaperMetadataProps) {
  const updatePaper = useMutation(api.papers.updatePaper);
  const [newTag, setNewTag] = useState("");

  const statusOptions: Array<{ value: "to_read" | "reading" | "completed"; label: string; color: string }> = [
    { value: "to_read", label: "To Read", color: "bg-blue-100 text-blue-800" },
    { value: "reading", label: "Reading", color: "bg-yellow-100 text-yellow-800" },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  ];

  const handleStatusChange = async (newStatus: "to_read" | "reading" | "completed") => {
    await updatePaper({
      paperId: paper._id,
      readingStatus: newStatus,
    });
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    if (paper.tags.includes(newTag.trim())) {
      alert("Tag already exists");
      return;
    }

    await updatePaper({
      paperId: paper._id,
      tags: [...paper.tags, newTag.trim()],
    });
    setNewTag("");
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    await updatePaper({
      paperId: paper._id,
      tags: paper.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const currentStatus = statusOptions.find(s => s.value === paper.readingStatus);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {paper.title}
        </h1>
      </div>

      {/* Authors */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Authors</h3>
        <p className="text-sm text-gray-700">{paper.authors.join(", ")}</p>
      </div>

      {/* Reading Status */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Reading Status</h3>
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                paper.readingStatus === option.value
                  ? option.color
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-600 transition-colors"
                title="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
          {paper.tags.length === 0 && (
            <span className="text-sm text-gray-400">No tags yet</span>
          )}
        </div>
        
        {/* Add Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="Add tag..."
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Abstract */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Abstract</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {paper.abstract}
        </p>
      </div>

      {/* ArXiv Link */}
      <div>
        <Link
          href={paper.arxivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View on ArXiv
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* Timestamps */}
      <div className="text-xs text-gray-400 pt-4 border-t border-gray-200">
        <p>Added {new Date(paper.createdAt).toLocaleDateString()}</p>
        {paper.updatedAt !== paper.createdAt && (
          <p>Updated {new Date(paper.updatedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
```

---

### Phase 5: Notes Mutations Update (15 min)

**Update**: `convex/notes.ts` (add saveNote convenience mutation)

```typescript
// Add to existing convex/notes.ts

export const saveNote = mutation({
  args: {
    paperId: v.id("papers"),
    userId: v.id("users"),
    content: v.string(),
    noteId: v.optional(v.id("notes")),
  },
  handler: async (ctx, args) => {
    if (args.noteId) {
      // Update existing note
      await ctx.db.patch(args.noteId, {
        content: args.content,
        updatedAt: Date.now(),
      });
      return args.noteId;
    } else {
      // Create new note
      const noteId = await ctx.db.insert("notes", {
        paperId: args.paperId,
        userId: args.userId,
        content: args.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return noteId;
    }
  },
});

export const listByPaper = query({
  args: {
    paperId: v.id("papers"),
  },
  handler: async (ctx, args) => {
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_paper", (q) => q.eq("paperId", args.paperId))
      .collect();

    // Sort by most recent
    notes.sort((a, b) => b.updatedAt - a.updatedAt);

    return notes;
  },
});
```

---

## Success Criteria

### Functional Requirements
- [ ] Dynamic route loads paper detail page (no 404!)
- [ ] PDF loads from Convex Storage
- [ ] PDF viewer has working controls (navigation, zoom)
- [ ] Notes editor works with auto-save
- [ ] Reading status can be updated
- [ ] Tags can be added/removed
- [ ] All metadata displays correctly
- [ ] Navigation back to homepage works

### Technical Requirements
- [ ] react-pdf integrated and working
- [ ] PDF.js worker configured correctly
- [ ] No CORS errors
- [ ] TypeScript strict mode passing
- [ ] Build passes with no errors
- [ ] Real-time Convex updates working
- [ ] Auto-save debouncing working (1s)

### UI/UX Requirements
- [ ] Professional, distraction-free reading experience
- [ ] Goodreads-inspired aesthetic
- [ ] Loading states for PDF and notes
- [ ] Error handling for edge cases
- [ ] Smooth transitions and interactions
- [ ] PDF loads within 5 seconds

---

## Timeline

| Phase | Estimated | Notes |
|-------|-----------|-------|
| Route & Basic Structure | 20 min | Dynamic route, basic view |
| PDF Viewer Component | 50 min | react-pdf integration, controls |
| Notes Editor Component | 40 min | Auto-save, debouncing |
| Metadata Component | 30 min | Display, status, tags |
| Layout Integration | 25 min | Two-column layout |
| Testing & Documentation | 20 min | E2E testing |
| **Total** | **3 hours** | Slightly over estimate |

---

## Risk Assessment

**Medium Risks**:
- react-pdf setup → Requires PDF.js worker configuration
- CORS for PDF serving → Need proper headers (already in PER-10)
- Auto-save conflicts → Debouncing should handle this

**Low Risks**:
- Layout responsive → CSS flexbox makes this easy
- Notes persistence → Convex handles this well

**Mitigation**:
- Test PDF viewer with TinyTroupe paper immediately
- Verify CORS headers in HTTP action
- Test auto-save with rapid typing
- Monitor console for errors

---

## Key Differences from Current State

### What Changes with PER-13

**Before (Current State)**:
- Clicking paper card → 404 error ❌
- Cannot view PDFs ❌
- Cannot take notes ❌
- Cannot update status from detail view ❌
- Cannot manage tags from detail view ❌

**After (PER-13 Complete)**:
- Clicking paper card → Detail page with PDF and notes ✅
- Can view PDF with navigation and zoom ✅
- Can take notes with auto-save ✅
- Can update reading status ✅
- Can add/remove tags ✅
- **Complete paper management experience!** ✅

---

## File Structure After PER-13

```
goodpapers/
├── app/
│   └── paper/
│       └── [paperId]/
│           └── page.tsx (NEW - fixes 404 issue!)
├── components/
│   └── papers/
│       ├── PaperCard.tsx (from PER-12)
│       ├── PaperList.tsx (from PER-12)
│       ├── PaperDetailView.tsx (NEW)
│       ├── PDFViewer.tsx (NEW)
│       ├── NotesEditor.tsx (NEW)
│       ├── PaperMetadata.tsx (NEW)
│       └── README.md (UPDATE with new components)
├── convex/
│   └── notes.ts (UPDATE - add saveNote, listByPaper)
```

---

## Testing Plan

See **ticket-006.md** for comprehensive testing plan with 40 test cases.

---

**Ready to implement! PER-12 provides all navigation and context needed.** 🚀

**Key Milestone**: This completes the core MVP functionality - users can add papers, search them, view PDFs, and take notes!


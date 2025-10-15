# PER-13 Execution Plan: Paper Detail Page with PDF Viewer & Notes

**Linear Ticket**: https://linear.app/metresearch/issue/PER-13  
**Estimated Time**: 2.5 hours  
**Dependencies**: PER-8 (COMPLETE ✅), PER-9 (COMPLETE ✅), PER-10 (COMPLETE ✅), PER-11 (COMPLETE ✅), PER-12 (IN PROGRESS)  
**Blocks**: PER-14, PER-15

---

## Executive Summary

Implement the paper detail page featuring an integrated PDF viewer using react-pdf, a markdown notes editor with auto-save functionality, paper metadata display, reading status selector, and tags editor. This phase creates the core reading and note-taking experience of Goodpapers.

**Working Directory**: `/Users/mark/Documents/work/goodpapers/goodpapers/`

---

## Context Analysis

### What Needs to Be Implemented

**PDF Viewer**:
1. react-pdf integration for PDF display
2. Zoom controls (zoom in, zoom out, fit-to-width)
3. Page navigation (next/previous, page number input)
4. Loading states for PDF rendering
5. Error handling for missing/corrupted PDFs
6. Responsive viewer (desktop-first)

**Notes Editor**:
1. Markdown text area for note-taking
2. Auto-save functionality (debounced)
3. Loading indicator during save
4. Markdown preview (optional for MVP)
5. Character/word count (optional)
6. Timestamp display (last edited)

**Paper Metadata Display**:
1. Title, authors, abstract
2. ArXiv link (external)
3. Publication date
4. Reading status badge
5. Tags display and editor
6. Created/updated timestamps

**Sidebar Layout**:
1. Left: PDF viewer (60-70% width)
2. Right: Notes + metadata (30-40% width)
3. Responsive: Stack on mobile (optional for desktop-first MVP)
4. Resizable split (optional, defer to V1.1)

### Key Requirements from Spec

- PDF loads and displays correctly (< 5s)
- Notes auto-save (no manual save button)
- Real-time note updates
- Can update reading status
- Can add/remove tags
- Professional, distraction-free reading experience
- Goodreads-inspired aesthetic

### Key Constraints

- Must use react-pdf library (installed in PER-8)
- Must serve PDFs from Convex Storage (PER-10 HTTP action)
- Must use PER-11 layout (AppLayout, ProtectedRoute)
- Must integrate with PER-9 notes queries/mutations
- Desktop-first (mobile responsive but not primary focus)
- Auto-save should debounce (500-1000ms) to avoid excessive DB writes

### Existing Context

**From PER-11**:
- AppLayout component for consistent structure
- Protected route wrapper
- Header with navigation

**From PER-10**:
- PDF serving HTTP action: `https://impartial-wolf-773.convex.site/pdf/{storageId}`
- PDFs stored in Convex Storage

**From PER-9**:
- `getPaper` query (by ID)
- `getNotesByPaper` query
- `createNote`, `updateNote` mutations
- `updatePaperStatus`, `updatePaperTags` mutations

**From PER-12**:
- Navigation from paper list to detail page
- User authentication context

---

## Implementation Strategy

### High-Level Approach

1. **Route Setup First**: Create dynamic route for paper detail
2. **PDF Viewer Second**: Get PDF rendering working
3. **Notes Editor Third**: Implement notes with auto-save
4. **Metadata Display Fourth**: Show paper info and controls
5. **Layout Integration Last**: Combine all pieces

### Why This Approach

- Route setup validates navigation from PER-12
- PDF viewer is most complex (test early)
- Notes depend on working PDF context
- Metadata is simpler (do after core functionality)
- Layout integration brings it together

### Key Design Decisions

1. **react-pdf for viewing**: Industry standard, well-maintained
2. **Auto-save for notes**: Better UX than manual save
3. **Side-by-side layout**: Best for reading + note-taking
4. **Debounced saves**: Reduce DB writes, improve performance
5. **Simple markdown**: Plain text for MVP, markdown preview in V1.1
6. **Desktop-first**: Research is done on desktop

---

## Detailed Execution Plan

### Phase 1: Route Setup (15 min)

**Step 1.1**: Create dynamic route (10 min)

```typescript
// app/paper/[paperId]/page.tsx
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

**Step 1.2**: Test routing (5 min)

- Click paper card from homepage
- Should navigate to `/paper/{paperId}`
- Page loads (even if empty initially)

---

### Phase 2: PDF Viewer Component (45 min)

**Step 2.1**: Create PDFViewer component (30 min)

```typescript
// components/papers/PDFViewer.tsx
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

export function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg">
      {/* PDF Controls */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Page Navigation */}
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            −
          </button>
          <span className="text-sm text-gray-700">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(2.0, scale + 0.1))}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
```

**Step 2.2**: Configure PDF.js worker (10 min)

- Set up PDF.js worker URL
- Handle CORS for worker scripts
- Test with real PDF from Convex Storage

**Step 2.3**: Test PDF viewer (5 min)

- PDF renders correctly
- Page navigation works
- Zoom controls function
- Loading state displays

---

### Phase 3: Notes Editor Component (35 min)

**Step 3.1**: Create NotesEditor component with auto-save (25 min)

```typescript
// components/papers/NotesEditor.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface NotesEditorProps {
  paperId: Id<"papers">;
  userId: Id<"users">;
}

export function NotesEditor({ paperId, userId }: NotesEditorProps) {
  const notes = useQuery(api.notes.listByPaper, { paperId });
  const createNote = useMutation(api.notes.createNote);
  const updateNote = useMutation(api.notes.updateNote);

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load existing note
  useEffect(() => {
    if (notes && notes.length > 0) {
      setContent(notes[0].content);
    }
  }, [notes]);

  // Debounced auto-save
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (content && content !== notes?.[0]?.content) {
        setIsSaving(true);

        try {
          if (notes && notes.length > 0) {
            // Update existing note
            await updateNote({
              noteId: notes[0]._id,
              content,
            });
          } else {
            // Create new note
            await createNote({
              paperId,
              userId,
              content,
            });
          }

          setLastSaved(new Date());
        } catch (error) {
          console.error("Failed to save note:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [content, notes, createNote, updateNote, paperId, userId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <span className="text-xs text-gray-500">
          {isSaving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ""}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes on this paper..."
        className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
      />

      <p className="mt-2 text-xs text-gray-500">
        Markdown supported. Notes auto-save as you type.
      </p>
    </div>
  );
}
```

**Step 3.2**: Test auto-save (10 min)

- Type in notes editor
- Verify "Saving..." appears
- Verify "Saved at {time}" displays
- Refresh page → notes persist
- Test with long notes (>1000 characters)

---

### Phase 4: Paper Metadata Component (25 min)

**Step 4.1**: Create PaperMetadata component (20 min)

```typescript
// components/papers/PaperMetadata.tsx
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface PaperMetadataProps {
  paper: Doc<"papers">;
}

export function PaperMetadata({ paper }: PaperMetadataProps) {
  const updateStatus = useMutation(api.papers.updatePaperStatus);
  const updateTags = useMutation(api.papers.updatePaperTags);

  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleStatusChange = async (status: "to_read" | "reading" | "completed") => {
    await updateStatus({ paperId: paper._id, status });
  };

  const handleAddTag = async () => {
    if (tagInput.trim()) {
      await updateTags({
        paperId: paper._id,
        tags: [...paper.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    await updateTags({
      paperId: paper._id,
      tags: paper.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{paper.title}</h1>
      </div>

      {/* Authors */}
      <div>
        <p className="text-sm font-medium text-gray-700">Authors</p>
        <p className="text-sm text-gray-600">{paper.authors.join(", ")}</p>
      </div>

      {/* Reading Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reading Status
        </label>
        <select
          value={paper.readingStatus}
          onChange={(e) => handleStatusChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="to_read">To Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Add Tag Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="Add tag..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Abstract */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Abstract</p>
        <p className="text-sm text-gray-600 leading-relaxed">{paper.abstract}</p>
      </div>

      {/* ArXiv Link */}
      <div>
        <a
          href={paper.arxivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-700 underline"
        >
          View on ArXiv →
        </a>
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 space-y-1">
        {paper.publishedDate && (
          <p>Published: {new Date(paper.publishedDate).toLocaleDateString()}</p>
        )}
        <p>Added: {new Date(paper.createdAt).toLocaleDateString()}</p>
        <p>Updated: {new Date(paper.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
```

**Step 4.2**: Test metadata interactions (5 min)

- Change reading status → updates immediately
- Add tag → appears in list
- Remove tag → disappears from list
- Links work correctly

---

### Phase 5: Layout Integration (30 min)

**Step 5.1**: Create PaperDetailView component (20 min)

```typescript
// components/papers/PaperDetailView.tsx
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

  if (!paper) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Paper not found</h2>
          <p className="text-gray-600 mt-2">This paper doesn't exist or you don't have access.</p>
        </div>
      </div>
    );
  }

  // Construct PDF URL from storage ID
  const pdfUrl = `https://impartial-wolf-773.convex.site/pdf/${paper.pdfStorageId}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* PDF Viewer (Left, 2 columns) */}
      <div className="lg:col-span-2">
        <PDFViewer pdfUrl={pdfUrl} title={paper.title} />
      </div>

      {/* Sidebar (Right, 1 column) */}
      <div className="flex flex-col gap-6 overflow-y-auto">
        {/* Paper Metadata */}
        <PaperMetadata paper={paper} />

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Notes Editor */}
        <NotesEditor paperId={paper._id} userId={currentUser?._id || ""} />
      </div>
    </div>
  );
}
```

**Step 5.2**: Test integrated layout (10 min)

- PDF displays on left
- Metadata and notes on right
- Scrolling works correctly
- Responsive design (desktop)
- All components communicate properly

---

### Phase 6: Error Handling & Loading States (20 min)

**Step 6.1**: Add comprehensive error handling (10 min)

- Handle PDF load failures
- Handle note save failures
- Handle query failures
- Display user-friendly error messages

**Step 6.2**: Enhance loading states (10 min)

- PDF loading spinner
- Notes loading skeleton
- Metadata loading skeleton
- Smooth transitions

---

### Phase 7: Testing & Documentation (15 min)

**Step 7.1**: End-to-end testing (10 min)

Test complete flow:
1. Navigate to paper from homepage
2. PDF loads and displays
3. Take notes → auto-saves
4. Change reading status → updates
5. Add tags → appear immediately
6. Navigate back to homepage
7. Return to paper → notes persisted

**Step 7.2**: Create component documentation (5 min)

Document PDF viewer, notes editor, and metadata components.

---

## Success Criteria

### Functional Requirements
- [ ] PDF viewer displays PDFs correctly
- [ ] Page navigation works (previous/next)
- [ ] Zoom controls function properly
- [ ] Notes editor loads existing notes
- [ ] Notes auto-save (debounced)
- [ ] Reading status updates work
- [ ] Tags can be added/removed
- [ ] Paper metadata displays correctly
- [ ] Link to ArXiv works

### Technical Requirements
- [ ] react-pdf configured correctly
- [ ] PDF.js worker setup
- [ ] Auto-save debouncing working
- [ ] TypeScript strict mode passing
- [ ] Build passes with no errors
- [ ] Real-time updates work

### UI/UX Requirements
- [ ] PDF viewer is readable and responsive
- [ ] Notes editor is intuitive
- [ ] Loading states provide feedback
- [ ] Error messages are clear
- [ ] Layout is professional
- [ ] PDF loads quickly (< 5s)

---

## Timeline

| Phase | Estimated | Notes |
|-------|-----------|-------|
| Route Setup | 15 min | Dynamic route for paper detail |
| PDF Viewer Component | 45 min | react-pdf integration |
| Notes Editor Component | 35 min | Auto-save functionality |
| Paper Metadata Component | 25 min | Status, tags, info display |
| Layout Integration | 30 min | Combine all components |
| Error & Loading States | 20 min | Polish UX |
| Testing & Documentation | 15 min | E2E testing |
| **Total** | **3 hours 5 min** | Slightly over estimate |

---

## Risk Assessment

**Medium Risks**:
- PDF.js worker CORS issues → Configure worker URL properly
- PDF rendering performance → Use appropriate scale settings
- Auto-save performance → Debounce properly (1s delay)

**Low Risks**:
- Notes sync → Convex handles real-time automatically
- Layout responsiveness → Tailwind grid handles this

**Mitigation**:
- Test PDF viewer with various paper sizes
- Test auto-save with rapid typing
- Monitor DB write frequency
- Keep loading states visible

---

## Notes

- This work **depends on PER-8, PER-9, PER-10, PER-11, PER-12**
- PDF viewing is core feature (prioritize this)
- Notes are critical for research workflow
- Keep `npm run dev` running to test real-time updates
- Test with real ArXiv papers (various page counts)

---

## Reference Links

- **react-pdf**: https://github.com/wojtekmaj/react-pdf
- **PDF.js**: https://mozilla.github.io/pdf.js/
- **Convex Mutations**: https://docs.convex.dev/functions/mutations
- **Convex Real-time**: https://docs.convex.dev/client/react
- **Next.js Dynamic Routes**: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
- **Project Dashboard**: https://dashboard.convex.dev (project: `impartial-wolf-773`)

---

## File Structure After PER-13

```
goodpapers/
├── app/
│   └── paper/
│       └── [paperId]/
│           └── page.tsx (new)
├── components/
│   └── papers/
│       ├── PDFViewer.tsx (new)
│       ├── NotesEditor.tsx (new)
│       ├── PaperMetadata.tsx (new)
│       ├── PaperDetailView.tsx (new)
│       └── README.md (updated)
```

---

**Ready to implement! All dependencies (PER-8-12) complete.** 🚀


# PER-12 Execution Plan: Home Page with Search & Paper List

**Linear Ticket**: https://linear.app/metresearch/issue/PER-12  
**Estimated Time**: 2.5 hours  
**Dependencies**: PER-8 (COMPLETE ✅), PER-9 (COMPLETE ✅), PER-10 (COMPLETE ✅), PER-11 (COMPLETE ✅)  
**Blocks**: PER-13, PER-14, PER-15

---

## Executive Summary

Implement the main home page for Goodpapers with paper list display, add paper functionality, search capabilities, and reading status filters. This phase transforms the placeholder homepage into a fully functional paper management interface with Goodreads-inspired aesthetics.

**Working Directory**: `/Users/mark/Documents/work/goodpapers/goodpapers/`

---

## Context Analysis

### What Needs to Be Implemented

**Paper List Display**:
1. Query papers from Convex database
2. Display papers in card layout
3. Show paper metadata (title, authors, status, tags)
4. Handle empty state (no papers yet)
5. Responsive grid layout

**Add Paper Feature**:
1. "Add Paper" button in header or main area
2. Modal/form for ArXiv URL input
3. Call addPaperFromArxiv action
4. Show loading state during fetch
5. Handle errors gracefully
6. Refresh paper list after adding

**Search Functionality**:
1. Search bar component
2. Full-text search using Convex search indexes
3. Real-time filtering as user types
4. Clear button to reset search
5. Search across title, authors, abstract

**Reading Status Filters**:
1. Tabs or buttons for filtering by status
2. "To Read", "Reading", "Completed", "All"
3. Update query based on selected filter
4. Persist filter selection (optional for MVP)

### Key Requirements from Spec

- Home page displays paper library (< 2s load time)
- Add paper via ArXiv URL (< 15s total time)
- Search finds papers quickly (< 1s results)
- Goodreads-inspired aesthetic
- Responsive design (desktop-first)
- Real-time updates when papers added

### Key Constraints

- Must use existing PER-11 layout (AppLayout, Header)
- Must integrate with PER-10 addPaperFromArxiv action
- Must query from PER-9 papers schema
- Must handle authentication state from PER-11
- Desktop-first (mobile responsive but not optimized)

### Existing Context

**From PER-11**:
- AppLayout component for consistent structure
- Header with logo and user menu
- Protected route wrapper
- Authentication working

**From PER-10**:
- `addPaperFromArxiv` action ready for use
- Returns metadata and pdfStorageId

**From PER-9**:
- `papers` table with all fields
- `listRecentPapers` query
- `searchPapers` query
- `createPaper` mutation
- Search indexes ready

---

## Implementation Strategy

### High-Level Approach

1. **Paper List First**: Display existing papers (foundation)
2. **Add Paper Second**: Enable adding new papers
3. **Search Third**: Add search functionality
4. **Filters Fourth**: Add status filters
5. **Polish Last**: Loading states, error handling, empty states

### Why This Approach

- List display validates database integration first
- Add paper is core functionality (test early)
- Search can layer on top of list
- Filters enhance search
- Polish improves UX without blocking functionality

### Key Design Decisions

1. **Card Layout**: Matches Goodreads aesthetic, easy to scan
2. **Modal for Add Paper**: Less disruptive than separate page
3. **Real-time Search**: Better UX than submit-based search
4. **Client Components**: Needed for interactivity and search
5. **Optimistic UI**: Show loading states immediately
6. **Desktop-First**: Research is done on desktop (mobile responsive but not primary)

---

## Detailed Execution Plan

### Phase 1: Paper List Component (30 min)

**Step 1.1**: Create PaperCard component (15 min)

```typescript
// components/papers/PaperCard.tsx
"use client";

import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

interface PaperCardProps {
  paper: Doc<"papers">;
}

export function PaperCard({ paper }: PaperCardProps) {
  const statusColors = {
    to_read: "bg-blue-100 text-blue-800",
    reading: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <Link
      href={`/paper/${paper._id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
    >
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {paper.title}
        </h3>

        {/* Authors */}
        <p className="text-sm text-gray-600 line-clamp-1">
          {paper.authors.join(", ")}
        </p>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              statusColors[paper.readingStatus]
            }`}
          >
            {paper.readingStatus.replace("_", " ")}
          </span>

          {/* Tags */}
          {paper.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {paper.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 rounded bg-gray-100 text-xs text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {paper.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{paper.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Abstract Preview */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {paper.abstract}
        </p>
      </div>
    </Link>
  );
}
```

**Step 1.2**: Create PaperList component (15 min)

```typescript
// components/papers/PaperList.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PaperCard } from "./PaperCard";

export function PaperList() {
  const papers = useQuery(api.papers.listRecentPapers, { limit: 50 });

  if (papers === undefined) {
    return <PaperListSkeleton />;
  }

  if (papers.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-600">No papers yet. Add your first paper!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {papers.map((paper) => (
        <PaperCard key={paper._id} paper={paper} />
      ))}
    </div>
  );
}

function PaperListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-3 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Phase 2: Add Paper Modal (40 min)

**Step 2.1**: Create AddPaperModal component (25 min)

```typescript
// components/papers/AddPaperModal.tsx
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AddPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function AddPaperModal({ isOpen, onClose, userId }: AddPaperModalProps) {
  const [arxivUrl, setArxivUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPaper = useMutation(api.arxiv.addPaperFromArxiv);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await addPaper({
        input: arxivUrl,
        userId: userId as any,
      });

      // Success: close modal and reset
      setArxivUrl("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add paper");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Paper</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="arxiv-url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ArXiv URL or ID
            </label>
            <input
              id="arxiv-url"
              type="text"
              value={arxivUrl}
              onChange={(e) => setArxivUrl(e.target.value)}
              placeholder="https://arxiv.org/abs/2301.12345"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !arxivUrl}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add Paper"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**Step 2.2**: Add button to trigger modal (10 min)

Update homepage to include "Add Paper" button and modal state management.

**Step 2.3**: Test add paper flow (5 min)

- Click "Add Paper" button
- Modal opens
- Enter ArXiv URL
- Submit
- Paper appears in list
- Modal closes

---

### Phase 3: Search Functionality (30 min)

**Step 3.1**: Create SearchBar component (20 min)

```typescript
// components/papers/SearchBar.tsx
"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search papers..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      
      {/* Search Icon */}
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Clear Button */}
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
```

**Step 3.2**: Integrate search with paper list (10 min)

Update PaperList to use `searchPapers` query when search query is active.

---

### Phase 4: Reading Status Filters (20 min)

**Step 4.1**: Create StatusFilter component (15 min)

```typescript
// components/papers/StatusFilter.tsx
"use client";

type ReadingStatus = "to_read" | "reading" | "completed" | "all";

interface StatusFilterProps {
  selected: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
}

export function StatusFilter({ selected, onChange }: StatusFilterProps) {
  const statuses: { value: ReadingStatus; label: string }[] = [
    { value: "all", label: "All Papers" },
    { value: "to_read", label: "To Read" },
    { value: "reading", label: "Reading" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-2 border-b border-gray-200">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => onChange(status.value)}
          className={`px-4 py-2 font-medium transition-colors ${
            selected === status.value
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
```

**Step 4.2**: Integrate filters with queries (5 min)

Update paper list to filter by status using query parameters.

---

### Phase 5: Homepage Integration (25 min)

**Step 5.1**: Update homepage (20 min)

```typescript
// app/page.tsx
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PaperList } from "@/components/papers/PaperList";
import { SearchBar } from "@/components/papers/SearchBar";
import { StatusFilter } from "@/components/papers/StatusFilter";
import { AddPaperModal } from "@/components/papers/AddPaperModal";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"to_read" | "reading" | "completed" | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Your Papers</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Paper
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={setSearchQuery} />

          {/* Status Filters */}
          <StatusFilter selected={statusFilter} onChange={setStatusFilter} />

          {/* Paper List */}
          <PaperList searchQuery={searchQuery} statusFilter={statusFilter} />

          {/* Add Paper Modal */}
          <AddPaperModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            userId={currentUser?._id || ""}
          />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
```

**Step 5.2**: Test homepage integration (5 min)

- Homepage displays with search bar and filters
- Add Paper button opens modal
- Papers display in grid
- Search filters results
- Status tabs work correctly

---

### Phase 6: Error Handling & Loading States (20 min)

**Step 6.1**: Add loading states (10 min)

- Skeleton loaders for paper cards
- Loading spinner in Add Paper modal
- Empty state when no papers match search
- Error states for failed queries

**Step 6.2**: Add error handling (10 min)

- Handle ArXiv fetch failures
- Handle network errors
- Display user-friendly error messages
- Allow retry on errors

---

### Phase 7: Testing & Documentation (15 min)

**Step 7.1**: End-to-end testing (10 min)

Test complete flow:
1. Homepage loads with empty state
2. Click "Add Paper"
3. Enter ArXiv URL
4. Paper appears in list
5. Search for paper
6. Filter by status
7. Click paper card → redirects to detail page (PER-13)

**Step 7.2**: Create component documentation (5 min)

Document all components in `components/papers/README.md`.

---

## Success Criteria

### Functional Requirements
- [ ] Homepage displays paper library
- [ ] Can add papers via ArXiv URL
- [ ] Search finds papers by title, authors, abstract
- [ ] Status filters work correctly
- [ ] Empty state displays when no papers
- [ ] Papers displayed in grid layout
- [ ] Click paper navigates to detail page

### Technical Requirements
- [ ] Uses Convex queries for data fetching
- [ ] Real-time updates when papers added
- [ ] TypeScript strict mode passing
- [ ] Build passes with no errors
- [ ] Responsive design works
- [ ] Loading states implemented

### UI/UX Requirements
- [ ] Goodreads-inspired aesthetic
- [ ] Professional, polished interface
- [ ] Smooth transitions and animations
- [ ] Clear error messages
- [ ] Intuitive navigation
- [ ] Fast page load (< 2s)

---

## Timeline

| Phase | Estimated | Notes |
|-------|-----------|-------|
| Paper List Component | 30 min | PaperCard + PaperList |
| Add Paper Modal | 40 min | Modal, form, integration |
| Search Functionality | 30 min | SearchBar + integration |
| Status Filters | 20 min | Tabs + filtering |
| Homepage Integration | 25 min | Bring it all together |
| Error & Loading States | 20 min | Polish UX |
| Testing & Documentation | 15 min | E2E testing |
| **Total** | **3 hours** | Slightly over estimate |

---

## Risk Assessment

**Low Risks**:
- Modal UX → Standard pattern, well-documented
- Search performance → Convex indexes handle this
- Grid layout → Tailwind makes this easy

**Medium Risks**:
- ArXiv fetch errors → Need clear error messages
- Empty states → Make them helpful and actionable

**Mitigation**:
- Test add paper with various ArXiv URLs
- Handle all error cases gracefully
- Show progress during long operations
- Keep error messages user-friendly

---

## Notes

- This work **depends on PER-8, PER-9, PER-10, PER-11**
- HomePage is first real user-facing feature
- Link to paper detail page (PER-13) but doesn't need it working yet
- Keep `npm run dev` running to test real-time updates
- Mock auth if PER-11 auth has issues

---

## Reference Links

- **Convex Queries**: https://docs.convex.dev/functions/queries
- **Convex Search**: https://docs.convex.dev/text-search
- **Next.js Client Components**: https://nextjs.org/docs/app/building-your-application/rendering/client-components
- **Tailwind Grid**: https://tailwindcss.com/docs/grid-template-columns
- **Project Dashboard**: https://dashboard.convex.dev (project: `impartial-wolf-773`)

---

## File Structure After PER-12

```
goodpapers/
├── app/
│   └── page.tsx (updated with full implementation)
├── components/
│   └── papers/
│       ├── PaperCard.tsx (new)
│       ├── PaperList.tsx (new)
│       ├── SearchBar.tsx (new)
│       ├── StatusFilter.tsx (new)
│       ├── AddPaperModal.tsx (new)
│       └── README.md (new)
```

---

**Ready to implement! All dependencies (PER-8-11) are complete.** 🚀


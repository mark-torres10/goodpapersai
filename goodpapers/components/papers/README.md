# Paper Components

This directory contains the React components for displaying and managing papers in the Goodpapers application.

## Components

### PaperCard.tsx
Displays a single paper in card format with:
- Title (line-clamp-2 for long titles)
- Authors (line-clamp-1)
- Reading status badge (color-coded)
- Tags (shows first 3, "+N" for more)
- Abstract preview (line-clamp-2)
- Hover effects and navigation to paper detail page

**Usage:**
```tsx
import { PaperCard } from "@/components/papers/PaperCard";

<PaperCard paper={paper} />
```

### PaperList.tsx
Displays a grid of paper cards with:
- Loading skeleton while fetching
- Empty state when no papers
- Responsive grid layout (1/2/3 columns)
- Search and status filtering support

**Usage:**
```tsx
import { PaperList } from "@/components/papers/PaperList";

<PaperList 
  searchQuery={searchQuery} 
  statusFilter={statusFilter}
  userId={userId}
/>
```

### AddPaperModal.tsx
Modal dialog for adding papers via ArXiv URL or ID with:
- Input validation
- Loading states during fetch
- Error handling and display
- Success/failure feedback

**Usage:**
```tsx
import { AddPaperModal } from "@/components/papers/AddPaperModal";

<AddPaperModal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  userId={currentUser?._id ?? null}
/>
```

### SearchBar.tsx
Real-time search input with:
- Search icon
- Clear button (when query present)
- Callback on query change

**Usage:**
```tsx
import { SearchBar } from "@/components/papers/SearchBar";

<SearchBar onSearch={setSearchQuery} />
```

### StatusFilter.tsx
Tab-based status filter with:
- All Papers, To Read, Reading, Completed tabs
- Active state highlighting
- Keyboard accessible

**Usage:**
```tsx
import { StatusFilter } from "@/components/papers/StatusFilter";

<StatusFilter 
  selected={statusFilter} 
  onChange={setStatusFilter} 
/>
```

## Features

- **Real-time Updates**: Components use Convex queries for live data
- **Responsive Design**: Mobile-first with desktop optimization
- **Goodreads Aesthetic**: Clean, book-focused design
- **Performance**: Optimized queries, skeleton loaders, lazy loading
- **Accessibility**: Keyboard navigation, ARIA labels, semantic HTML

## Integration

All components integrate with:
- Convex backend (`api.papers.*`, `api.arxiv.*`)
- Next.js App Router
- Tailwind CSS for styling
- TypeScript for type safety

## Testing

See `projects/2025-10-14_goodpapers_v1_mvp/tickets/ticket-005.md` for comprehensive testing plan.


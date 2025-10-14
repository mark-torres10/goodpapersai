# Goodpapers V1 MVP - Task Checklist

**Last Updated**: 2025-10-14  
**Status**: Planning Complete, Ready to Execute

---

## Phase 1: Setup (30 min)

**PER-8: Project Setup & Infrastructure**
- [ ] Initialize Next.js 15 with TypeScript + Tailwind CSS v3
- [ ] Install Convex and configure
- [ ] Set up Google OAuth in Google Cloud Console
- [ ] Configure Convex Auth with Google provider
- [ ] Install dependencies (react-pdf, fast-xml-parser, react-markdown)
- [ ] Verify builds pass

---

## Phase 2: Backend (2.5-3 hours) - Can run in parallel

**PER-9: Convex Backend - Database Schema & Core Functions**
- [ ] Define schema (papers, notes, users tables)
- [ ] Create validators for all tables
- [ ] Set up indexes (by_arxiv_id, by_user_modified, etc.)
- [ ] Set up search indexes (search_content, search_authors, etc.)
- [ ] Implement paper queries (list, get, getRecentlyModified, search, autocomplete)
- [ ] Implement paper mutations (create, update, delete, addTag, removeTag)
- [ ] Implement note queries/mutations
- [ ] Implement user queries/mutations

**PER-10: ArXiv API Integration & PDF Storage**
- [ ] Create ArXiv utilities (URL parsing, ID extraction)
- [ ] Implement fetchFromArxiv action
- [ ] Implement downloadPdf action with timeout
- [ ] Implement processArxivUrl pipeline action
- [ ] Implement duplicate detection
- [ ] Create HTTP action for PDF serving
- [ ] Test with 5 diverse papers

---

## Phase 3: Frontend Auth (1.5 hours)

**PER-11: Frontend Auth & Core Layout**
- [ ] Create ConvexClientProvider
- [ ] Set up root layout with Inter font (next/font)
- [ ] Create SignInButton component
- [ ] Create UserMenu component
- [ ] Create Header/navigation
- [ ] Test sign in/sign out flow
- [ ] Verify session persistence

---

## Phase 4: Home Page (2.5 hours)

**PER-12: Home Page with Search & Paper List**
- [ ] Create SearchBar component with autocomplete
- [ ] Create PaperCard component
- [ ] Build home page (app/page.tsx)
- [ ] Create AddPaperModal
- [ ] Create EmptyState component
- [ ] Style with Tailwind (Goodreads-inspired)
- [ ] Test search and paper addition

---

## Phase 5: Paper Detail Page (2.5 hours)

**PER-13: Paper Detail Page with PDF Viewer & Notes**
- [ ] Create PdfViewerClient component
- [ ] Dynamic import PdfViewer (ssr: false)
- [ ] Create NotesEditor with auto-save
- [ ] Create paper detail page (app/papers/[id]/page.tsx)
- [ ] Create PaperMetadata component
- [ ] Create ReadingStatusSelector
- [ ] Create TagsEditor
- [ ] Test PDF viewing and notes

---

## Phase 6: Polish & Deploy (2.5 hours)

**PER-14: Polish, Observability & Deployment**
- [ ] Refine UI (spacing, colors, typography)
- [ ] Add loading states (skeletons, spinners)
- [ ] Implement error handling (try/catch, toast)
- [ ] Add empty states
- [ ] Enable Vercel Analytics
- [ ] Add Convex logging
- [ ] Configure pre-commit hooks (Prettier)
- [ ] Deploy to Vercel (production)
- [ ] Deploy Convex backend
- [ ] Configure production OAuth
- [ ] End-to-end test in production

---

## Phase 7: Testing & Launch (1.5 hours)

**PER-15: Final Testing & Launch Validation**
- [ ] Browser compatibility (Chrome, Safari, Firefox)
- [ ] ArXiv integration (5 test papers)
- [ ] PDF rendering (large/small PDFs)
- [ ] Notes functionality
- [ ] Search functionality
- [ ] Performance validation (Lighthouse)
- [ ] Core Web Vitals check (Vercel Analytics)
- [ ] Hydration error check
- [ ] Smoke test (full flow)
- [ ] Fix critical bugs

---

## Final Validation

- [ ] All tickets completed
- [ ] All tests passing
- [ ] Deployed to production
- [ ] Performance goals met
- [ ] **Can use daily for managing papers** (ultimate validation)

---

**Total Progress**: 0/8 tickets completed


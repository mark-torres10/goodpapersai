# Goodpapers V1 MVP - Task Checklist

**Last Updated**: 2025-10-14  
**Status**: Planning Complete, Ready to Execute

---

## Phase 1: Setup (30 min)

**PER-8: Project Setup & Infrastructure** ✅ COMPLETE  
**PR**: https://github.com/mark-torres10/goodpapersai/pull/5  
**Actual Time**: 40 minutes

- [x] Initialize Next.js 15 with TypeScript + App Router
- [x] Install Convex and configure
- [x] Set up Convex Auth with Google provider
- [x] Install dependencies (react-pdf, fast-xml-parser, react-markdown)
- [x] Configure Tailwind CSS v4 (Next.js 15 compatible)
- [x] Verify builds pass
- [x] Create comprehensive documentation
- [x] Add JSDoc docstrings
- [x] Run full test suite (26/26 passed)
- [x] Browser testing complete

---

## Phase 2: Backend (2.5-3 hours) - Can run in parallel

**PER-9: Convex Backend - Database Schema & Core Functions** ✅ COMPLETE  
**PR**: https://github.com/mark-torres10/goodpapersai/pull/6  
**Actual Time**: 3 hours (including testing and CodeRabbit AI improvements)

- [x] Define schema (papers, notes, users tables)
- [x] Create validators for all tables
- [x] Set up indexes (by_user, by_user_updated, by_arxiv_id, by_user_arxiv)
- [x] Set up search indexes (search_papers with user filtering)
- [x] Implement paper queries (listRecentPapers, listPapers, getPaper, getPaperByArxivId, searchPapers)
- [x] Implement paper mutations (createPaper, updatePaper, deletePaper with cascade)
- [x] Implement note queries/mutations (getNotesByPaper, saveNote, deleteNote)
- [x] Add TypeScript type aliases (PaperId, NoteId, UserId)
- [x] Apply CodeRabbit AI performance optimizations
- [x] Comprehensive testing and documentation

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

**Total Progress**: 2/8 tickets completed (25.0%)


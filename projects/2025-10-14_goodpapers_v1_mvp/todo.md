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

**PER-10: ArXiv API Integration & PDF Storage** ✅ COMPLETE  
**PR**: https://github.com/mark-torres10/goodpapersai/pull/8  
**Actual Time**: 2 hours

- [x] Create ArXiv utilities (URL parsing, ID extraction)
- [x] Implement fetchFromArxiv action
- [x] Implement downloadPdf action with timeout
- [x] Implement processArxivUrl pipeline action
- [x] Implement duplicate detection
- [x] Create HTTP action for PDF serving
- [x] Test with 5 diverse papers

---

## Phase 3: Frontend Auth (1.5 hours)

**PER-11: Frontend Auth & Core Layout** ✅ COMPLETE  
**PR**: https://github.com/mark-torres10/goodpapersai/pull/12  
**Actual Time**: 3 hours (including testing and security hardening)

- [x] Create ConvexClientProvider (upgraded to ConvexAuthNextjsProvider)
- [x] Set up root layout with Inter font (next/font)
- [x] Create SignInForm component with Google OAuth
- [x] Create UserMenu component with dropdown
- [x] Create Header/navigation with responsive design
- [x] Create ProtectedRoute wrapper component
- [x] Create AppLayout wrapper component
- [x] Create sign-in page (app/sign-in/page.tsx)
- [x] Create error boundary (app/error.tsx)
- [x] Create custom 404 page (app/not-found.tsx)
- [x] Add security headers (CSP, X-Frame-Options, etc.)
- [x] Add user query function (convex/users.ts)
- [x] Test sign in/sign out flow (48/48 tests passed)
- [x] Verify session persistence
- [x] Comprehensive documentation and expert reviews

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

**Total Progress**: 4/8 tickets completed (50.0%)

---

## Timeline Summary

**Completed Phases**:
- Phase 1 (PER-8): 40 minutes ✅
- Phase 2 (PER-9 + PER-10): ~5 hours ✅
- Phase 3 (PER-11): 3 hours ✅
- **Total: ~8.5 hours of 11.5 hours** (74% time elapsed)

**Remaining Phases**:
- Phase 4 (PER-12): 2.5-3 hours (Home Page)
- Phase 5 (PER-13): 2.5-3 hours (Paper Detail)
- Phase 6 (PER-14): 2.5 hours (Polish & Deploy)
- Phase 7 (PER-15): 1.5 hours (Testing & Launch)

**Status**: On track for same-day completion!


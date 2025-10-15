# Task Plan: Goodpapers V1 MVP

**Feature**: Goodpapers V1 MVP - Academic Paper Reading Tracker  
**Project Folder**: `/projects/2025-10-14_goodpapers_v1_mvp/`  
**Linear Project ID**: 6225599d-c0c5-4cde-b439-7dbfeec29b66  
**Linear Project URL**: https://linear.app/metresearch/project/goodpapers-v1-mvp-academic-paper-reading-tracker-92ca77070efe  
**Target Deadline**: 2025-10-14 (Ship TODAY)  
**Total Estimated Effort**: 11.5 hours  

---

## Ticket Execution Order

### Sequential Execution Required:

**Must Complete First**:
- **PER-8**: Phase 1 - Project Setup & Infrastructure (30 min)

**Then Execute in Parallel**:
- **PER-9**: Phase 2 - Convex Backend - Database Schema & Core Functions (2.5-3 hours)
- **PER-10**: Phase 2B - ArXiv API Integration & PDF Storage (2 hours)

**Then Execute**:
- **PER-11**: Phase 3 - Frontend Auth & Core Layout (1.5 hours)

**Then Execute**:
- **PER-12**: Phase 4 - Home Page with Search & Paper List (2.5 hours)

**Then Execute**:
- **PER-13**: Phase 5 - Paper Detail Page with PDF Viewer & Notes (2.5 hours)

**Then Execute**:
- **PER-14**: Phase 6 - Polish, Observability & Deployment (2.5 hours)

**Finally**:
- **PER-15**: Phase 7 - Final Testing & Launch Validation (1.5 hours)

---

## Summary of Parallel Execution Opportunities

**Phase 1** (Must be first):
- PER-8: Setup (30 min)

**Phase 2** (Can run in parallel after Phase 1):
- PER-9: Backend Schema & Functions (2.5-3 hours) ⚡ PARALLEL
- PER-10: ArXiv API Integration (2 hours) ⚡ PARALLEL

**Phase 3-7** (Sequential):
- PER-11: Auth & Layout (1.5 hours)
- PER-12: Home Page (2.5 hours)
- PER-13: Paper Detail (2.5 hours)
- PER-14: Polish & Deploy (2.5 hours)
- PER-15: Testing (1.5 hours)

**Total Time with Parallel Execution**: ~10.5 hours (vs 11.5 hours sequential)

---

## Task Breakdown Table

| Ticket | Title | Effort | Priority | Dependencies | Status | PR URL |
|--------|-------|--------|----------|--------------|--------|--------|
| PER-8 | Phase 1: Project Setup & Infrastructure | 30 min | Urgent | None | Done | https://github.com/mark-torres10/goodpapersai/pull/5 |
| PER-9 | Phase 2: Convex Backend - Schema & Functions | 2.5-3 hrs | Urgent | PER-8 | Todo | - |
| PER-10 | Phase 2B: ArXiv API Integration & PDF Storage | 2 hrs | Urgent | PER-8 | Todo | - |
| PER-11 | Phase 3: Frontend Auth & Core Layout | 1.5 hrs | Urgent | PER-8, PER-9 | Todo | - |
| PER-12 | Phase 4: Home Page with Search & Paper List | 2.5 hrs | Urgent | PER-8-11 | Todo | - |
| PER-13 | Phase 5: Paper Detail with PDF & Notes | 2.5 hrs | Urgent | PER-8-12 | Todo | - |
| PER-14 | Phase 6: Polish, Observability & Deploy | 2.5 hrs | High | PER-8-13 | Todo | - |
| PER-15 | Phase 7: Final Testing & Launch | 1.5 hrs | High | PER-8-14 | Todo | - |

---

## Deliverables

### Phase 1: Setup (30 min)
- Next.js 15 project with TypeScript + Tailwind CSS v3
- Convex configured and connected
- Google OAuth credentials set
- All dependencies installed
- Build passes

### Phase 2: Backend (2.5-3 hours)
- Database schema with papers, notes, users tables
- All search indexes created
- All queries and mutations implemented
- TypeScript types auto-generated

### Phase 2B: ArXiv Integration (2 hours)
- ArXiv metadata fetching action
- PDF download and storage action
- Pipeline action (processArxivUrl)
- HTTP action for PDF serving
- Error handling for all edge cases

### Phase 3: Auth & Layout (1.5 hours)
- Convex Auth integration
- Sign in/sign out flow
- Root layout with next/font
- Header/navigation component

### Phase 4: Home Page (2.5 hours)
- Search bar with autocomplete
- Paper list component
- Add paper modal
- Empty state
- Goodreads-inspired styling

### Phase 5: Paper Detail (2.5 hours)
- PDF viewer with react-pdf
- Notes editor with auto-save
- Paper metadata display
- Reading status selector
- Tags editor

### Phase 6: Polish & Deploy (2.5 hours)
- UI refinement
- Loading states
- Error handling
- Observability setup (Vercel Analytics + Convex logs)
- Pre-commit hooks
- Production deployment

### Phase 7: Testing (1.5 hours)
- Browser compatibility testing (Chrome, Safari, Firefox)
- ArXiv integration testing (5 diverse papers)
- Performance validation (Lighthouse, Core Web Vitals)
- Smoke test
- Bug fixes

---

## Checkpoint Strategy

**Hour 6 Checkpoint**:
- Assess: Are core features working? (Auth, Add paper, View PDF, Basic notes)
- If behind schedule: Cut tags, reading status, autocomplete
- If on track: Continue with full scope

**Minimum Launchable Product** (if scope cut needed):
- ✅ Google OAuth authentication
- ✅ Add paper via ArXiv URL
- ✅ View PDF in browser
- ✅ Basic paper-level notes (plain text)
- ✅ List all papers on home page

**Can Defer to V1.1**:
- ⏸️ Tags system
- ⏸️ Reading status tracking
- ⏸️ Search autocomplete
- ⏸️ Markdown formatting in notes
- ⏸️ UI polish

---

## Success Metrics

**User Experience**:
- < 30s to authenticate with Google
- < 15s to add ArXiv paper
- < 5s to search and find paper
- < 5s for PDF to load

**Technical**:
- < 2s home page load
- < 1s search results
- Real-time note updates
- Zero downtime deployment

**Validation**:
- **"I would choose to use this daily"** (ultimate success metric)


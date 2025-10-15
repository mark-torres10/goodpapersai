# 📚 Goodpapers V1 MVP - Project Dashboard

**Academic Paper Reading Tracker - Goodreads for Research Papers**

---

## 📋 Project Overview

**Project ID**: `6225599d-c0c5-4cde-b439-7dbfeec29b66`  
**Linear Project**: [View in Linear](https://linear.app/metresearch/project/goodpapers-v1-mvp-academic-paper-reading-tracker-92ca77070efe)  
**Team**: Personal Projects  
**Status**: 🟢 In Progress - PER-8 Complete (1/8 tickets)  
**Deadline**: 🚀 Ship TODAY (October 14, 2025)

---

## 🎯 Vision

A simple, elegant app for tracking academic papers - like Goodreads for research. Add ArXiv papers with one click, read PDFs in-browser, take notes, and search your library.

**Core Value**: Seamless paper reading with integrated note-taking.

---

## ✨ V1 Features

1. ✅ Google OAuth authentication
2. ✅ Home page with search bar + autocomplete
3. ✅ Add ArXiv papers via URL (automatic metadata + PDF download)
4. ✅ PDF viewer in-browser
5. ✅ Paper-level notes (markdown support)
6. ✅ Reading status tracking (To Read, Reading, Completed)
7. ✅ Simple tags for organization
8. ✅ Full-text search (titles, authors, abstracts, notes)

---

## 🏗️ Architecture

**Frontend**: Next.js 15 (App Router) + React + Tailwind CSS v3  
**Backend**: Convex (database, auth, file storage, functions)  
**Auth**: Convex Auth with Google OAuth  
**PDF**: react-pdf library  
**Deploy**: Vercel (frontend) + Convex (backend)  
**Monitoring**: Vercel Analytics + Convex Logs

---

## 📊 Project Status

### Tickets Overview

| Ticket | Title | Status | Effort | Progress |
|--------|-------|--------|--------|----------|
| [PER-8](https://linear.app/metresearch/issue/PER-8) | Phase 1: Setup | Todo | 30 min | 0% |
| [PER-9](https://linear.app/metresearch/issue/PER-9) | Phase 2: Backend Schema | Todo | 2.5-3 hrs | 0% |
| [PER-10](https://linear.app/metresearch/issue/PER-10) | Phase 2B: ArXiv Integration | Todo | 2 hrs | 0% |
| [PER-11](https://linear.app/metresearch/issue/PER-11) | Phase 3: Auth & Layout | Todo | 1.5 hrs | 0% |
| [PER-12](https://linear.app/metresearch/issue/PER-12) | Phase 4: Home Page | Todo | 2.5 hrs | 0% |
| [PER-13](https://linear.app/metresearch/issue/PER-13) | Phase 5: Paper Detail | Todo | 2.5 hrs | 0% |
| [PER-14](https://linear.app/metresearch/issue/PER-14) | Phase 6: Polish & Deploy | 2.5 hrs | 0% |
| [PER-15](https://linear.app/metresearch/issue/PER-15) | Phase 7: Testing | Todo | 1.5 hrs | 0% |

**Total**: 0/8 tickets completed (0%)

---

## 🔄 Execution Order

### Must Complete First:
- **PER-8**: Setup & Infrastructure (30 min)

### Can Run in Parallel (After PER-8):
- **PER-9**: Backend Schema & Functions (2.5-3 hrs) ⚡
- **PER-10**: ArXiv Integration (2 hrs) ⚡

### Sequential After Backend:
- **PER-11**: Auth & Layout (1.5 hrs) - _Depends on PER-8, PER-9_
- **PER-12**: Home Page (2.5 hrs) - _Depends on PER-8-11_
- **PER-13**: Paper Detail (2.5 hrs) - _Depends on PER-12_
- **PER-14**: Polish & Deploy (2.5 hrs) - _Depends on PER-13_
- **PER-15**: Testing (1.5 hrs) - _Depends on PER-14_

**Optimization**: Run PER-9 and PER-10 in parallel → Save ~2 hours!

---

## ⏱️ Timeline

**Total Estimated Time**: 11.5 hours sequential, **~10.5 hours with parallel execution**

**Checkpoint at Hour 6**:
- If on track: Continue with full scope
- If behind: Cut tags, reading status, autocomplete (defer to V1.1)

**Minimum Launchable Product** (if scope cut):
- Auth + Add paper + View PDF + Basic notes + List papers

---

## 📁 Project Files

- [`spec.md`](./spec.md) - Complete technical specification
- [`braindump.md`](./braindump.md) - Initial context gathering and brainstorming
- [`EXPERT_REVIEWS.md`](./EXPERT_REVIEWS.md) - 4 persona reviews (avg 99% score)
- [`plan_goodpapers_v1.md`](./plan_goodpapers_v1.md) - Detailed task plan with execution order
- [`todo.md`](./todo.md) - Checklist of all subtasks
- [`logs.md`](./logs.md) - Development progress logs
- [`lessons_learned.md`](./lessons_learned.md) - Insights and process improvements
- [`metrics.md`](./metrics.md) - Time tracking and performance metrics
- [`metadata.md`](./metadata.md) - Project metadata and IDs
- [`retrospective/`](./retrospective/) - Ticket and project retrospectives

---

## 🎓 Expert Review Summary

**4 expert personas reviewed the spec** with an average score of **34.5/35 (99%)**:

1. **Rapid Prototyper** (35/35) - "Textbook MVP scoping. Start RIGHT NOW."
2. **Next.js Expert** (34/35) - "Excellent architecture. Add Core Web Vitals testing."
3. **MVP Frontend Architect** (35/35) - "Strongest MVP spec I've reviewed."
4. **MVP API Integration** (34/35) - "ArXiv integration is well-designed."

**Consensus**: ✅ PROCEED WITH IMPLEMENTATION IMMEDIATELY

---

## 🎯 Success Criteria

**User Validation**:
- ✅ "I can actually use this to manage my papers"
- ✅ "This is better than my current workflow"  
- ✅ "I would choose to use this daily"
- ✅ "The UI feels professional and pleasant"

**Technical Validation**:
- ✅ All builds pass with no errors
- ✅ Performance goals met (< 2s page load, < 5s PDF, < 1s search)
- ✅ Core Web Vitals pass (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- ✅ Works in Chrome, Safari, Firefox

**Ship Validation**:
- ✅ Deployed to production by EOD today
- ✅ Can add real ArXiv papers and use daily

---

## 🚀 Next Steps

1. **Start PER-8** (Setup) RIGHT NOW
2. **Spawn 2 parallel agents** for PER-9 and PER-10 after setup
3. **Track time religiously** - Set timer for each phase
4. **Hit hour 6 checkpoint** - Assess progress, cut scope if needed
5. **Ship even if imperfect** - Working MVP > perfectly polished vaporware

---

## 📚 Key Resources

**Documentation**:
- [Convex Docs](https://docs.convex.dev)
- [Convex Auth](https://labs.convex.dev/auth)
- [Next.js Docs](https://nextjs.org/docs)
- [ArXiv API](https://arxiv.org/help/api)

**Tools**:
- [Convex Dashboard](https://dashboard.convex.dev)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Last Updated**: 2025-10-14  
**Status**: Ready to build 🚀


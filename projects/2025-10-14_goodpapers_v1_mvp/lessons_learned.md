# Lessons Learned: Goodpapers V1 MVP

**Project**: Goodpapers V1 MVP  
**Project ID**: 6225599d-c0c5-4cde-b439-7dbfeec29b66  
**Status**: In Progress

---

## Planning Phase Lessons

### What Went Well
- **Multi-persona review process** caught important details before implementation (Core Web Vitals testing, font optimization, timeout handling, duplicate detection)
- **Convex as complete backend** dramatically simplified architecture (eliminated need for Railway, Supabase, Clerk)
- **Clear scope cut-off strategy** (hour 6 checkpoint) provides pragmatic fallback plan
- **9-10 hour estimate** is realistic after expert reviews (vs initial 6-8 hours)

### Challenges Identified
- **Initial timeline was too aggressive** - 6-8 hours would have been tight, 9-10 hours is more realistic
- **Observability initially weak** - Had to add explicit 30-minute setup for Vercel Analytics + Convex logs
- **Testing initially insufficient** - Added browser compatibility, Core Web Vitals, hydration error checks

### Process Improvements
- **Four expert reviews took ~30 minutes** but added significant value (caught issues early)
- **Following PROJECT_PLANNING_EXECUTION_OUTLINE.md** ensured systematic coverage
- **Brain dump → Spec → Review → Iterate** workflow worked well

---

## Implementation Lessons

_Will be updated as implementation progresses_

### Technical Discoveries
_To be filled during development_

### Estimation Accuracy
_Track actual vs estimated time for each phase_

### What Would We Do Differently Next Time
_Retrospective insights after V1 ships_

---

## Post-Launch Lessons

_To be filled after 1 week of usage_

### Usage Patterns
- What features are actually used?
- What features were built but not needed?
- What features are missing?

### Performance Reality
- Did we meet performance goals?
- What was slower/faster than expected?

### Architecture Decisions
- Was Convex the right choice?
- Was ArXiv-only the right scope?
- Was paper-level notes sufficient?

---

## V1.1 Insights

_Planned improvements based on actual usage, not assumptions_


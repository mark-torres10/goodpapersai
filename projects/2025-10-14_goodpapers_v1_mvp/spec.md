# 🧾 Spec: Goodpapers - Academic Paper Reading Tracker

## 1. Problem Statement

### Who is affected?
**Primary User**: You (Mark) - a researcher who reads academic papers and needs a better way to track, organize, and annotate them.

### What's the pain point?
Currently, there's no simple, elegant way to:
- Track which papers you're reading
- Keep notes organized alongside papers
- Quickly search through your paper library
- See reading progress and status
- Access papers and notes in one place

Existing solutions (Zotero, Mendeley) are too complex for the simple use case of "I want to track papers I'm reading like Goodreads tracks books."

### Why now?
- You're actively reading papers and need a solution immediately
- Modern tools (Convex, Next.js 15) make it possible to ship a polished MVP in a single day
- The faster you ship, the sooner you can use it for your actual research workflow

### Strategic alignment
Personal productivity tool to improve research workflow efficiency. This enables faster paper consumption and better knowledge retention through organized note-taking.

## 2. Desired Outcomes & Metrics

### Success Criteria
**User Experience Success:**
- ✅ Can authenticate with Google in < 30 seconds
- ✅ Can add a new ArXiv paper in < 15 seconds from URL paste to paper in library
- ✅ Can search and find a paper in < 5 seconds
- ✅ Can read a paper and add notes seamlessly without friction
- ✅ UI feels polished and professional (inspired by Goodreads aesthetic)

**Technical Success:**
- ✅ All builds pass with no errors
- ✅ Application loads in < 2 seconds on initial visit
- ✅ PDF viewer loads papers in < 5 seconds
- ✅ Search returns results in < 1 second
- ✅ Real-time updates work (notes appear immediately when created)
- ✅ Zero downtime deployment

**Business Success:**
- ✅ **Actually gets used daily for managing papers**
- ✅ Reduces friction in research workflow
- ✅ Provides measurable value over manual paper management

### Metrics to Track
- **Engagement**: Number of papers added per week
- **Usage**: Daily active use (sessions per day)
- **Retention**: Papers with notes vs. papers without (indicates actual usage)
- **Performance**: Page load times, search latency, PDF render times
- **Reliability**: Error rates, deployment success rate

### Deadline
**Ship TODAY** (October 14, 2025) - Polished MVP deployed and ready for use.

**Estimated Time**: 9-10 hours of focused development (with AI pair programming)

## 3. In Scope / Out of Scope

### ✅ In Scope for V1

**Core Features:**
1. **Authentication**
   - Google OAuth (Sign in with Google)
   - Single user (you)
   - Session management

2. **Home Page**
   - Google-style search bar with autocomplete
   - Last 10 modified papers displayed below search
   - "Add new paper" button
   - Clean, Goodreads-inspired UI

3. **Paper Addition**
   - Input ArXiv URL
   - Automatic metadata extraction (title, authors, abstract, publication date)
   - Automatic PDF download and storage
   - Database entry creation

4. **Paper Reading & Annotation**
   - PDF viewer (react-pdf)
   - Paper-level notes with markdown support
   - Notes displayed alongside paper
   - Simple, distraction-free interface

5. **Paper Management**
   - List all papers
   - Search across titles, authors, abstracts, and notes
   - Reading status tracking (To Read, Reading, Completed)
   - Simple tags for organization
   - Automatic timestamp tracking

**Technical Implementation:**
- Next.js 15 (App Router) with React
- Tailwind CSS v3 for styling
- Convex for backend (database, auth, file storage, functions)
- Vercel deployment for frontend
- Pre-commit hooks for code quality

### ❌ Out of Scope for V1

**Deferred Features:**
- Multi-user support (architecture supports it, not exposed in V1)
- Paper recommendations
- Social features (sharing, commenting)
- Advanced PDF annotations (highlights, text selection, drawings)
- Mobile app
- Offline support
- Export functionality (to BibTeX, Zotero, etc.)
- Integration with reference managers
- Citation management
- Multiple paper sources (only ArXiv in V1, no direct PDF uploads)
- Advanced search filters and faceted search
- Collections/shelves organization
- Browser extension
- Email integration
- AI-powered paper summaries
- Citation graph visualization
- Collaboration features
- Reading progress tracking (current page)
- Ratings system
- Paper version tracking

### 🤔 Maybe Later (Post-V1)
- Other paper sources (PMLR, ACL Anthology, direct PDF upload)
- Page-specific notes (vs. paper-level only)
- Reading progress percentage
- Simple rating system (5 stars)
- Paper due dates/reminders

## 4. Stakeholders & Dependencies

### Stakeholders
- **Primary User**: You (Mark)
- **Developer**: AI agent (with your oversight)

### External Dependencies
1. **Google OAuth**
   - Dependency: Google Cloud Console project
   - Required: OAuth 2.0 credentials
   - Impact: Authentication won't work without proper setup

2. **ArXiv API**
   - Dependency: ArXiv public API (export.arxiv.org/api/query)
   - Constraint: Rate limiting (respect API limits)
   - Impact: Paper metadata fetching

3. **ArXiv PDF Server**
   - Dependency: ArXiv PDF hosting (arxiv.org/pdf/)
   - Constraint: File sizes can be large (10-50MB)
   - Impact: PDF download and storage

### Technical Dependencies
1. **Convex**
   - Backend platform (database, auth, file storage, functions)
   - Free tier sufficient for single-user use
   - Provides: Real-time reactivity, TypeScript backend, file storage

2. **Vercel**
   - Frontend hosting
   - Free tier sufficient
   - Provides: Automatic deployments, edge functions, fast global CDN

3. **NPM Packages**
   - `convex` - Convex client and server
   - `@convex-dev/auth` - Authentication
   - `react-pdf` - PDF rendering
   - `react-markdown` - Markdown notes rendering
   - Tailwind CSS v3

### System Interfaces
- **Frontend ↔ Convex**: Real-time queries and mutations via Convex React client
- **Convex ↔ ArXiv API**: HTTP actions for metadata and PDF fetching
- **Convex ↔ Google OAuth**: Convex Auth provider integration
- **Frontend ↔ Convex Storage**: PDF serving via HTTP actions

## 5. Risks / Unknowns

### Known Risks

**1. ArXiv API Rate Limiting**
- **Risk**: Too many requests could result in rate limiting
- **Mitigation**: Cache metadata, respect API limits, graceful error handling
- **Severity**: Low (single user unlikely to hit limits)

**2. PDF File Sizes**
- **Risk**: Large PDFs (50MB+) could impact storage and load times
- **Mitigation**: Use Convex file storage (handles large files), lazy loading for PDFs
- **Severity**: Medium (affects UX but not critical)

**3. PDF Rendering Performance**
- **Risk**: Complex PDFs may render slowly in browser
- **Mitigation**: Use react-pdf with worker, show loading states, optimize rendering
- **Severity**: Low (most academic PDFs render fine)

**4. Search Performance**
- **Risk**: Full-text search could be slow with many papers
- **Mitigation**: Convex search is optimized, use indexes properly, limit results
- **Severity**: Low (single user unlikely to have thousands of papers quickly)

**5. Google OAuth Configuration**
- **Risk**: OAuth setup can be tricky with redirect URIs
- **Mitigation**: Follow Convex Auth docs precisely, test thoroughly
- **Severity**: Medium (blocks authentication if wrong)

### Unknowns / Research Spikes

**1. ArXiv Metadata Parsing**
- **Unknown**: Exact XML schema and parsing logic for ArXiv API responses
- **Discovery**: Implement and test with real ArXiv papers
- **Time**: 30 minutes

**2. PDF Storage Limits**
- **Unknown**: Convex free tier storage limits
- **Discovery**: Check Convex docs, monitor usage
- **Time**: 5 minutes (documentation lookup)

**3. react-pdf Compatibility**
- **Unknown**: How well react-pdf works with Next.js 15 App Router
- **Discovery**: Test implementation, check for SSR issues
- **Time**: 15 minutes

### Edge Cases to Handle
1. **Invalid ArXiv URLs**: User pastes non-ArXiv link
2. **ArXiv Paper Not Found**: 404 from ArXiv API
3. **PDF Download Failure**: Network error or ArXiv unavailable
4. **Large PDF Timeout**: PDF takes too long to download
5. **Empty Search Results**: User searches for non-existent paper
6. **Duplicate Papers**: User tries to add same paper twice
7. **Malformed ArXiv ID**: Invalid ID format
8. **No PDF Available**: Some ArXiv papers might not have PDFs
9. **Browser Compatibility**: PDF rendering may fail in Safari or older browsers (document browser requirements, add upgrade message)
10. **Network Disconnection**: Loss of connection during operations (show retry option)

## 6. UX Notes & Accessibility

### User Journey - Today vs. Tomorrow

**Today (Without Goodpapers):**
1. Find paper on ArXiv
2. Download PDF manually
3. Save to random folder on computer
4. Open in PDF reader
5. Take notes in separate app (Notion, Google Docs, etc.)
6. Forget where you saved the paper
7. Lose track of what you've read vs. what's pending

**Tomorrow (With Goodpapers):**
1. Find paper on ArXiv
2. Copy URL
3. Paste into Goodpapers → automatically fetched and stored
4. Read PDF in-app
5. Add notes right alongside the paper
6. Search instantly finds it later
7. Clear view of reading status and progress

### Key Flows

**Flow 1: First-time User**
1. Land on home page → see "Sign in with Google" button
2. Click → OAuth flow → redirect back
3. See empty state: "Add your first paper"
4. Click "Add Paper" → modal opens
5. Paste ArXiv URL → paper loads → success message
6. Redirected to paper detail page with PDF + notes

**Flow 2: Returning User - Add Paper**
1. Land on home page (authenticated)
2. See search bar + last 10 papers
3. Click "Add Paper" button
4. Paste ArXiv URL in modal
5. Paper automatically fetched → success notification
6. Modal closes → paper appears in list

**Flow 3: Search for Paper**
1. Start typing in search bar
2. See autocomplete suggestions (real-time)
3. Select paper or press Enter
4. Navigate to paper detail page

**Flow 4: Read and Annotate**
1. Open paper detail page
2. See PDF on left, notes editor on right
3. Read PDF, add notes in markdown
4. Notes auto-save as you type
5. Switch reading status from dropdown
6. Add tags

### UI Components & Design System

**Component Library:**
- Use Tailwind CSS v3 for all styling
- Minimal external UI library (build custom components)
- Inspired by Goodreads aesthetic (clean, simple, book-focused)

**Key Components:**
1. **SearchBar**: Large, centered, with autocomplete dropdown
2. **PaperCard**: Display paper in list (title, authors, status, tags)
3. **PdfViewer**: react-pdf wrapper with controls
4. **MarkdownEditor**: Simple textarea with markdown preview
5. **StatusSelector**: Dropdown for reading status
6. **TagsInput**: Pill-style tag editor
7. **Modal**: Add paper modal
8. **EmptyState**: When no papers yet

### Accessibility Requirements
- ✅ **Keyboard Navigation**: All actions accessible via keyboard
- ✅ **Screen Reader Support**: Proper ARIA labels on interactive elements
- ✅ **Color Contrast**: WCAG AA compliance for text and backgrounds
- ✅ **Focus States**: Clear focus indicators on all interactive elements
- ✅ **Semantic HTML**: Proper heading hierarchy, landmarks
- ✅ **Alt Text**: Images (if any) have descriptive alt text

### Mobile Considerations
- V1 is **desktop-first** (research is typically done on desktop)
- Responsive layout works on mobile but not optimized
- Mobile app is out of scope for V1

## 7. Technical Notes

### Architecture Overview

**Frontend: Next.js 15 + React**
- App Router (not Pages Router)
- Server Components where possible
- Client Components for interactivity
- Tailwind CSS v3 for styling
- TypeScript strict mode

**Backend: Convex (All-in-One)**
- Database: Convex document database
- Auth: Convex Auth with Google OAuth
- File Storage: Convex Storage
- Backend Functions: Queries, Mutations, Actions
- Real-time: Built-in reactivity

**Deployment:**
- Frontend: Vercel (automatic from Git)
- Backend: Convex (automatic from npx convex dev/deploy)

### Database Schema

**Tables:**
1. **`papers`**
   - `arxivId`: string (unique)
   - `arxivUrl`: string
   - `title`: string
   - `authors`: string[]
   - `abstract`: string
   - `publicationDate`: string (optional)
   - `pdfStorageId`: Id<"_storage">
   - `readingStatus`: "to_read" | "reading" | "completed"
   - `tags`: string[] (optional)
   - `userId`: Id<"users"> (optional, for future multi-user)

2. **`notes`**
   - `paperId`: Id<"papers">
   - `content`: string (markdown)
   - `userId`: Id<"users"> (optional)

3. **`users`**
   - `email`: string
   - `name`: string (optional)
   - `imageUrl`: string (optional)

**Indexes:**
- `papers.by_arxiv_id` on `[arxivId]`
- `papers.by_user_modified` on `[userId, _creationTime]`
- `papers.by_reading_status` on `[userId, readingStatus]`
- `papers.search_content` search index on `title`
- `papers.search_authors` search index on `authors`
- `papers.search_abstract` search index on `abstract`
- `notes.by_paper` on `[paperId]`
- `notes.by_user` on `[userId]`
- `notes.search_notes` search index on `content`
- `users.by_email` on `[email]`

### Convex Functions (Backend API)

**Queries (Read):**
- `papers:list` - List papers with pagination
- `papers:get` - Get single paper by ID
- `papers:search` - Full-text search across papers
- `papers:getRecentlyModified` - Last 10 papers by modification time
- `papers:autocomplete` - Search for autocomplete suggestions
- `notes:listByPaper` - Get all notes for a paper
- `users:getCurrent` - Get current authenticated user

**Mutations (Write):**
- `papers:create` - Create new paper entry
- `papers:update` - Update paper metadata/status
- `papers:delete` - Delete paper and associated notes
- `papers:addTag` - Add tag to paper
- `papers:removeTag` - Remove tag from paper
- `notes:create` - Create new note
- `notes:update` - Update existing note
- `notes:delete` - Delete note
- `users:upsert` - Create or update user (on login)

**Actions (External Calls):**
- `papers:fetchFromArxiv` - Fetch metadata from ArXiv API
- `papers:downloadPdf` - Download PDF from ArXiv, store in Convex
- `papers:processArxivUrl` - Full pipeline: validate URL → fetch metadata → download PDF → create entry

**HTTP Actions:**
- `GET /api/papers/pdf` - Serve PDF files from Convex Storage

### Implementation Approach

**Phase 1: Setup (30 min)**
- Initialize Next.js project with TypeScript + Tailwind
- Install Convex and configure
- Set up Google OAuth in Google Cloud Console
- Configure Convex Auth

**Phase 2: Backend (2.5-3 hours)**
- Define database schema in `convex/schema.ts`
- Implement paper queries and mutations (30-45 min)
- Implement note queries and mutations (30-45 min)
- Build ArXiv API integration - fetch + parse XML + error handling (45-60 min)
- Build PDF download and storage (action) (30 min)
- Implement full-text search with indexes (30 min)
- Create HTTP action for serving PDFs (15 min)

**Phase 3: Frontend Core (2 hours)**
- Set up Convex provider in Next.js layout
- Build authentication flow (sign in, sign out)
- Create home page with search bar
- Implement paper list component
- Build "Add Paper" modal
- Style with Tailwind CSS v3

**Phase 4: Paper Detail Page (2 hours)**
- Create paper detail route `/papers/[id]`
- Implement PDF viewer component
- Build markdown notes editor
- Display paper metadata
- Add reading status selector
- Add tags editor

**Phase 5: Polish, Observability & Deploy (2 hours)**
- Refine UI/UX (spacing, colors, typography) (45 min)
- Add loading states and skeletons (20 min)
- Implement error handling and user feedback (20 min)
- Add empty states (15 min)
- **Observability Setup** (30 min):
  - Enable Vercel Analytics for performance monitoring
  - Add Convex logging for critical operations (ArXiv calls, PDF downloads, auth events)
  - Add console error tracking with try/catch blocks
  - Test error scenarios and verify logs appear
- Deploy to Vercel (frontend) (5 min)
- Deploy to Convex (backend automatic) (5 min)
- Test end-to-end with real papers (15 min)

**Phase 6: Testing & Fixes (45 min)**
- **Browser Compatibility Testing** (15 min):
  - Test in Chrome, Safari, and Firefox
  - Verify PDF rendering works in all browsers
  - Document browser requirements if needed
- **ArXiv Integration Testing** (15 min):
  - Test with 5 diverse papers (long, short, many authors, special characters)
  - Verify edge cases (withdrawn papers, missing PDFs)
- **Smoke Test Checklist** (10 min):
  - Sign in → Add paper → View PDF → Add note → Search → Sign out
  - Verify all actions work without console errors
- Fix any bugs or issues (5 min buffer)

### Scope Management & Cut-off Strategy

**Timeline Checkpoint at Hour 6:**
If behind schedule, implement this scope reduction strategy:

**Minimum Launchable Product (Core Features Only):**
- ✅ Google OAuth authentication
- ✅ Add paper via ArXiv URL
- ✅ View PDF in browser
- ✅ Basic paper-level notes (plain text)
- ✅ List all papers on home page

**Can Defer to V1.1 (Ship Tomorrow):**
- ⏸️ Tags system
- ⏸️ Reading status tracking
- ⏸️ Search autocomplete (keep basic search)
- ⏸️ Markdown formatting in notes
- ⏸️ Goodreads-inspired UI polish

**Decision Point**: At hour 6, assess progress. If core features aren't working, cut deferred features and focus on shipping a functional MVP.

### Testing & Validation Strategy

**Automated Testing (V1):**
- **None** - Manual testing only for V1 to maximize shipping speed
- **Post-V1**: Add Playwright tests for critical paths (2 hours in V1.1)

**Manual Testing Checklist:**

**1. OAuth Flow Testing (5 min)**
- [ ] Test initial sign-in with Google
- [ ] Test sign-out and sign-in again
- [ ] Test session persistence across browser restarts
- [ ] Verify redirect URI configuration works

**2. ArXiv Integration Testing (15 min)**
Test with 5 diverse papers:
- [ ] Standard paper (e.g., Attention Is All You Need - 1706.03762)
- [ ] Paper with 100+ authors
- [ ] Paper with very long abstract
- [ ] Paper with special characters in title
- [ ] Recent paper (< 1 week old)

Verify edge cases:
- [ ] Invalid ArXiv URL shows clear error
- [ ] Malformed ArXiv ID shows error
- [ ] Network disconnect during fetch shows retry option
- [ ] Duplicate paper addition blocked

**3. PDF Rendering Testing (15 min)**
- [ ] Large PDF (30MB+) loads with progress indicator
- [ ] Small PDF (< 5MB) loads quickly
- [ ] PDF displays correctly in viewer
- [ ] PDF zoom and navigation controls work
- [ ] Test in Chrome, Safari, Firefox

**4. Notes Testing (5 min)**
- [ ] Can create note
- [ ] Can edit note
- [ ] Can delete note (with confirmation)
- [ ] Notes auto-save without lag
- [ ] Notes persist across page reloads

**5. Search Testing (5 min)**
- [ ] Search finds paper by title
- [ ] Search finds paper by author
- [ ] Search finds paper by abstract content
- [ ] Search finds paper by note content
- [ ] Empty search shows helpful message

**6. Performance Validation (5 min)**
Use Chrome DevTools to measure:
- [ ] Home page loads in < 2 seconds
- [ ] PDF viewer loads in < 5 seconds
- [ ] Search returns results in < 1 second
- [ ] No console errors or warnings

**Total Testing Time**: 50 minutes (built into Phase 6)

### Monitoring & Observability

**V1 Observability Stack:**

**1. Vercel Analytics (Free, Built-in)**
- Tracks Core Web Vitals automatically
- Shows real page load performance
- Monitors deployment health
- **Setup**: Enable in Vercel dashboard (2 minutes)

**2. Convex Logs (Free, Built-in)**
Log critical operations:
- **Authentication events**: Login success/failure
- **ArXiv API calls**: URL, success/failure, response time
- **PDF downloads**: File size, duration, success/failure
- **Search queries**: Query text, result count, duration
- **Errors**: All caught exceptions with stack traces

**Implementation Pattern**:
```typescript
// In Convex actions
console.log("[ArXiv] Fetching paper:", { arxivId, timestamp: Date.now() });
try {
  const result = await fetch(arxivUrl);
  console.log("[ArXiv] Success:", { arxivId, statusCode: result.status });
} catch (error) {
  console.error("[ArXiv] Failed:", { arxivId, error: error.message });
  throw error;
}
```

**3. Console Error Tracking**
Wrap critical operations in try/catch:
- PDF rendering
- ArXiv API calls
- Convex mutations
- Display user-friendly toast notifications for errors

**4. Simple Metrics Tracking (Optional for V1)**
Create a `metrics` table:
```typescript
{
  action: "paper_added" | "paper_read" | "note_created" | "search_performed",
  timestamp: number,
  userId: Id<"users">,
  metadata: object // additional context
}
```
One-line tracking: `await ctx.db.insert("metrics", {action: "paper_added", timestamp: Date.now()})`

**Post-V1 Monitoring Enhancements:**
- Add Sentry for production error tracking (15 minutes)
- Create metrics dashboard in Convex (1 hour)
- Set up uptime monitoring (e.g., UptimeRobot)

### Key Technical Decisions

**1. Why Convex over Supabase + Railway?**
- Single backend service (simpler)
- Real-time reactivity built-in
- TypeScript throughout (no Python needed)
- Integrated file storage
- Faster to ship
- Better developer experience

**2. Why Next.js 15 App Router?**
- Modern React features (Server Components)
- Better performance
- Simpler data fetching
- Recommended by Next.js team

**3. Why react-pdf?**
- Lightweight
- Good browser compatibility
- Sufficient for V1 needs
- Easy integration with React

**4. Why paper-level notes only?**
- Faster to ship
- Simpler UX
- Covers 80% of use case
- Can add page-specific notes in V2

**5. Why ArXiv only?**
- Covers primary use case (ML/CS papers)
- Simple, free API
- Can add other sources later
- Reduces scope for V1

### Extensibility Considerations

**Database schema includes `userId`** even though V1 is single-user:
- Easy to add multi-user in V2
- No migration needed when expanding
- Queries already filter by user

**Modular Convex functions** organized by resource:
- `convex/papers/` - All paper-related logic
- `convex/notes/` - All note-related logic
- `convex/users/` - All user-related logic
- Easy to extend with new features

**Component-based frontend:**
- Reusable components
- Easy to add new features
- Clean separation of concerns

## 8. Compliance, Cost, GTM

### Legal & Privacy
- **User Data**: Only stores email, name, and image URL from Google OAuth
- **Paper Data**: Papers are publicly available on ArXiv (no copyright issues)
- **Notes**: User's own notes (private data)
- **GDPR**: Single user (you), no GDPR requirements for personal use
- **Terms of Service**: Not required for personal use
- **Privacy Policy**: Not required for personal use

### Infrastructure Costs

**Estimated Monthly Costs (Single User):**
- **Convex**: $0 (free tier: 1GB storage, generous function limits)
- **Vercel**: $0 (free tier: 100GB bandwidth, unlimited deployments)
- **Google OAuth**: $0 (free)
- **Domain**: $0 (using Vercel domain) or ~$12/year if custom domain
- **Total**: $0/month for V1 single-user use

**Scaling Considerations (if multi-user later):**
- Convex: ~$25/month for Pro plan (beyond free tier)
- Vercel: ~$20/month for Pro plan (beyond free tier)
- Storage: PDFs are largest cost driver (estimate ~100MB per paper)

### Brand & Marketing
- **Not applicable**: Personal tool, no public launch
- **Name**: "Goodpapers" (wordplay on Goodreads)
- **No logo needed for V1**
- **No marketing materials needed**

### Support & Documentation
- **User documentation**: Not needed (you're the only user)
- **Code documentation**: Inline comments and README
- **Support**: Self-support
- **Onboarding**: Not needed

### Launch Coordination
- **Not applicable**: Personal deployment
- **No announcement needed**
- **No comms plan needed**
- **Deployment**: Push to production, test, start using

## 9. Success Criteria

### Definition of "Done"

**Functional Completeness:**
- ✅ Can sign in with Google OAuth
- ✅ Can add an ArXiv paper via URL
- ✅ Paper metadata automatically fetched and displayed
- ✅ PDF automatically downloaded and viewable
- ✅ Can add, edit, and delete notes on papers
- ✅ Can change reading status
- ✅ Can add and remove tags
- ✅ Can search papers (title, authors, abstract, notes)
- ✅ Autocomplete works in search bar
- ✅ Can see last 10 modified papers on home page
- ✅ UI is clean, polished, and Goodreads-inspired

**Technical Quality:**
- ✅ No build errors or warnings
- ✅ TypeScript strict mode passes
- ✅ Pre-commit hooks configured (Prettier for formatting)
- ✅ All critical user flows work end-to-end
- ✅ Error handling for common failure cases
- ✅ Loading states for async operations
- ✅ Responsive design (works on desktop)

**Performance:**
- ✅ Home page loads in < 2 seconds
- ✅ PDF viewer loads in < 5 seconds
- ✅ Search returns results in < 1 second
- ✅ Notes auto-save without lag
- ✅ Real-time updates work (see new notes immediately)

**Deployment:**
- ✅ Frontend deployed to Vercel
- ✅ Backend deployed to Convex
- ✅ Google OAuth configured and working
- ✅ Can access from any device with internet

**User Validation (You):**
- ✅ "I can actually use this to manage my papers"
- ✅ "This is better than my current workflow"
- ✅ "I would choose to use this daily"
- ✅ "The UI feels professional and pleasant to use"

### Acceptance Testing Checklist

**Authentication Flow:**
- [ ] Click "Sign in with Google" → OAuth flow works
- [ ] After sign-in, see authenticated home page
- [ ] User info displayed correctly
- [ ] Sign out works

**Add Paper Flow:**
- [ ] Click "Add Paper" → modal opens
- [ ] Paste ArXiv URL → paper fetches
- [ ] See success message
- [ ] Paper appears in list with correct metadata
- [ ] PDF is viewable
- [ ] Can't add duplicate paper (shows error)

**Search Flow:**
- [ ] Type in search bar → autocomplete appears
- [ ] Autocomplete shows relevant results
- [ ] Selecting result navigates to paper
- [ ] Search works for title, authors, abstract
- [ ] Empty search shows helpful message

**Paper Detail Flow:**
- [ ] Open paper → PDF loads on left
- [ ] Notes editor on right
- [ ] Can add note → saves automatically
- [ ] Can edit note → updates in real-time
- [ ] Can delete note → confirmation prompt
- [ ] Can change reading status → updates immediately
- [ ] Can add tag → appears in tag list
- [ ] Can remove tag → disappears from list
- [ ] Can navigate back to home

**Edge Cases:**
- [ ] Invalid ArXiv URL → clear error message
- [ ] Paper not found on ArXiv → helpful error
- [ ] Network error → retry option
- [ ] Large PDF → shows loading indicator
- [ ] Empty state (no papers) → friendly message

### Timeline Validation
- **Target**: Ship by end of day October 14, 2025
- **Total time estimate**: 9-10 hours (with AI pair programming)
  - Phase 1: Setup (30 min)
  - Phase 2: Backend (2.5-3 hours)
  - Phase 3: Frontend Core (2 hours)
  - Phase 4: Paper Detail Page (2 hours)
  - Phase 5: Polish, Observability & Deploy (2 hours)
  - Phase 6: Testing & Fixes (45 min)
- **Checkpoint**: Hour 6 - assess progress and cut scope if needed
- **Buffer**: 1-2 hours for unexpected issues (already built into phase estimates)
- **Final deadline**: 11:59 PM today

**Time Management Strategy:**
- Start immediately with Phase 1
- Track actual time per phase
- If falling behind at hour 6, implement scope cut-off strategy
- Ship functional MVP even if UI isn't perfectly polished

---

## Appendix: Key Resources

**Documentation:**
- Convex Docs: https://docs.convex.dev
- Convex Auth: https://labs.convex.dev/auth
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- react-pdf: https://github.com/wojtekmaj/react-pdf
- ArXiv API: https://arxiv.org/help/api

**Code Examples:**
- Convex + Next.js: https://docs.convex.dev/client/react/nextjs
- Convex File Storage: https://docs.convex.dev/file-storage
- Convex Full-Text Search: https://docs.convex.dev/search/text-search

**Tools:**
- Google Cloud Console: https://console.cloud.google.com
- Convex Dashboard: https://dashboard.convex.dev
- Vercel Dashboard: https://vercel.com/dashboard

---

**Spec Status**: ✅ Ready for Review
**Next Steps**: Multi-persona review → Iteration → Linear project creation → Implementation


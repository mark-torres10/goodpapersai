# Goodpapers - Brain Dump

## Project Vision
A Goodreads-style application for tracking academic papers, designed for personal use (single user initially). The goal is to provide a simple, elegant interface to manage reading progress, add notes, and organize research papers.

## Core User Story
"As a researcher, I want to easily track the papers I'm reading, add notes and comments, and quickly find papers I've previously worked with, so that I can better manage my research workflow."

## Tech Stack (User-Specified)

### Frontend
- **Framework**: React + Next.js
- **Styling**: Tailwind CSS v3 (per project conventions)
- **Deployment**: TBD (likely Vercel given Next.js)

### Backend
- **Platform**: Railway
- **Language**: Python 3.12
- **Package Manager**: uv (NOT pip or conda)

### Database
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for PDF files)

### Authentication
- **Provider**: Clerk (with Google OAuth - "Sign in with Google")
- **Decision**: Confirmed - using Clerk for authentication

### Infrastructure
- **Pre-commit hooks**: To be set up per CODING_REPO_CONVENTIONS.md
- **Linting**: Prettier for JS/TS, Ruff for Python
- **Build verification**: Required in pre-commit hooks

## V1 Feature Set

### 1. Authentication
- [ ] Google OAuth integration ("Sign in with Google")
- [ ] Single user authentication (no multi-user support in v1)
- [ ] Session management

### 2. Home Page
- [ ] Google-like search bar in the center
- [ ] Autocomplete functionality for paper search
- [ ] Display last 10 modified papers (below search bar, before typing)
- [ ] "Add new paper" button
- [ ] Clean, Goodreads-inspired UI

### 3. Paper Addition Flow
- [ ] Input field for ArXiv link
- [ ] Automatic paper download from ArXiv
- [ ] Extract metadata from ArXiv (title, authors, abstract, publication date, etc.)
- [ ] Store PDF file in database/storage
- [ ] Create database entry for paper

### 4. Paper Reading & Annotation
- [ ] PDF reader/viewer embedded in the app
- [ ] Ability to add notes and comments
- [ ] Associate notes with specific pages or selections (TBD scope)
- [ ] Save and display notes alongside paper

### 5. Paper Management
- [ ] View list of all papers
- [ ] Search across papers (title, authors, content?)
- [ ] Track reading status (to read, reading, completed?)
- [ ] Last modified timestamp tracking

## Technical Architecture Questions

### Data Model
**Papers Table** (Supabase):
- id (UUID, primary key)
- arxiv_id (string, unique)
- arxiv_url (string)
- title (string)
- authors (array/string)
- abstract (text)
- publication_date (date)
- pdf_url (string - Supabase Storage URL)
- added_at (timestamp)
- modified_at (timestamp)
- reading_status (enum: to_read, reading, completed)
- user_id (UUID, foreign key - if we expand to multi-user)

**Notes Table** (Supabase):
- id (UUID, primary key)
- paper_id (UUID, foreign key)
- content (text)
- page_number (integer, nullable)
- created_at (timestamp)
- modified_at (timestamp)
- user_id (UUID, foreign key - if we expand to multi-user)

### Backend Services (Python on Railway)
- ArXiv API integration service
- PDF download and storage service
- Search service (full-text search in Supabase?)
- API endpoints for frontend

### Frontend Components
- Authentication flow
- Home page with search
- Paper detail page with PDF viewer
- Add paper modal/page
- Notes editor component

## Open Questions & Clarifications Needed

### Authentication
1. **Convex vs Other Auth Providers**: User mentioned Convex for authentication. Convex is primarily a backend-as-a-service platform. Did you mean:
   - Clerk (popular for Next.js + Google OAuth)
   - NextAuth.js (built for Next.js)
   - Supabase Auth (since we're already using Supabase)
   - Or did you actually want to use Convex as the backend instead of Railway?

2. **Single User vs Multi-User**: V1 is single user. Should we design the database schema to support multiple users in the future, or keep it strictly single-user?

### Search Functionality
3. **Search Scope**: What should the search include?
   - Just paper titles?
   - Authors?
   - Abstract?
   - Full PDF content (would require OCR/text extraction)?
   - Notes content?

4. **Autocomplete Source**: Should autocomplete show:
   - Only papers already in the database?
   - Live results from ArXiv API?
   - Both?

### Paper Management
5. **Reading Status Tracking**: Should we include:
   - Reading status (to read, reading, completed)?
   - Progress tracking (e.g., page 23 of 45)?
   - Rating system (like Goodreads)?
   - Tags/categories for organization?

6. **Paper Sources**: V1 is ArXiv only, but should we design for:
   - Other sources in the future (PMLR, ACL Anthology, direct PDF uploads)?
   - Just keep it ArXiv-focused for simplicity?

### PDF Reader & Notes
7. **PDF Reader Choice**: Which PDF reader library?
   - react-pdf (popular, lightweight)
   - pdf.js (Mozilla's library, more features)
   - PSPDFKit (commercial, very feature-rich)
   - Other preference?

8. **Notes Granularity**: Should notes be:
   - Page-specific (note attached to page 5)?
   - Selection-specific (highlight text and add note)?
   - Paper-level only (general notes on the whole paper)?

9. **Note Format**: Should notes support:
   - Plain text only?
   - Markdown?
   - Rich text editor?

### Deployment & Infrastructure
10. **Backend on Railway**: What should the Python backend handle?
    - Just ArXiv API integration and PDF processing?
    - All API endpoints (vs using Supabase direct client access)?
    - Should we use FastAPI, Flask, or another framework?

11. **Frontend Deployment**: You mentioned Railway for backend. Where should frontend deploy?
    - Vercel (natural for Next.js)?
    - Railway (can host frontend too)?
    - Other?

12. **File Storage**: Confirm storage strategy:
    - Supabase Storage for PDFs (seems like the right choice)?
    - Railway storage?
    - S3?

### Development & Testing
13. **Local Development**: How should local development work?
    - Local Supabase instance (using Supabase CLI)?
    - Connect to cloud Supabase from local?
    - Mock data for development?

14. **Testing Strategy**: Should we include:
    - Unit tests for both frontend and backend?
    - E2E tests with Playwright (mentioned in conventions)?
    - Just manual testing for v1?

## Potential Risks & Considerations

### Technical Risks
1. **ArXiv API Rate Limits**: Need to handle rate limiting gracefully
2. **PDF File Size**: Large PDFs could impact storage costs and load times
3. **PDF Rendering Performance**: Some PDFs can be slow to render in browser
4. **Search Performance**: Full-text search on large papers could be slow
5. **Authentication Setup**: Getting OAuth configured correctly can be tricky

### Scope Risks
1. **Feature Creep**: Need to keep v1 simple and focused
2. **PDF Reader Complexity**: Building a good PDF reader with annotations is non-trivial
3. **Time Estimate**: This is actually a substantial project for a "simple" v1

### User Experience Risks
1. **Mobile Experience**: Should this work on mobile? (Not mentioned in requirements)
2. **Offline Support**: Should papers be accessible offline?
3. **Export Functionality**: Should users be able to export their notes/library?

## Initial Scope Boundaries

### In Scope for V1
- Single user (you)
- ArXiv papers only
- Google OAuth authentication
- Basic paper listing and search
- PDF viewing
- Note-taking (at least paper-level notes)
- Simple, clean UI inspired by Goodreads

### Out of Scope for V1
- Multi-user support
- Paper recommendations
- Social features (sharing, commenting with others)
- Advanced PDF annotations (highlights, drawings)
- Mobile app
- Offline support
- Export functionality
- Integration with reference managers (Zotero, Mendeley)
- Citation management
- Multiple paper sources beyond ArXiv
- Advanced search filters and sorting
- Collections/shelves (like Goodreads)

### Maybe in Scope (Needs Discussion)
- Reading status tracking (to read, reading, completed)
- Progress tracking (current page)
- Tags/categories
- Simple ratings
- Page-specific notes vs paper-level only

## Success Criteria (Draft)

### User Experience Success
- Can authenticate with Google in < 30 seconds
- Can add a new ArXiv paper in < 15 seconds
- Can search and find a paper in < 5 seconds
- Can read and annotate a paper seamlessly
- UI feels polished and professional (like Goodreads)

### Technical Success
- All builds pass with no errors
- Pre-commit hooks enforce code quality
- Application loads in < 2 seconds
- PDF viewer loads papers in < 5 seconds
- Search returns results in < 1 second
- 90%+ test coverage on critical paths

### Business Success
- Actually gets used (by you!) for managing papers
- Reduces friction in your research workflow
- Provides value over manual paper management

## Next Steps & Questions for User

### Critical Clarifications Needed
1. **Authentication provider clarification** - Convex, Clerk, NextAuth.js, Supabase Auth, or something else?
2. **Minimum viable note-taking** - What's the simplest version that would be useful? (page-level, paper-level, rich text?)
3. **Search scope** - Just titles and authors, or full content?
4. **Backend framework preference** - FastAPI, Flask, or other for the Python backend?

### Nice to Clarify (But Can Decide Later)
5. Reading status tracking - yes or no?
6. Tags/categories - yes or no?
7. Should we design database schema for future multi-user, or strictly single-user?
8. PDF reader library preference?
9. Frontend deployment platform?

### Project Planning Questions
10. **Timeline**: What's your target timeline for v1?
11. **Priority**: Is this a side project or more urgent?
12. **Iteration approach**: Build and ship incrementally, or finish everything before deploying?

## Additional Context to Consider

### Related Tools & Inspiration
- Goodreads (UI/UX inspiration)
- Zotero (reference management)
- Mendeley (PDF reader + notes)
- Notion (note-taking)
- Readwise (highlighting and note-taking)

### Potential Future Enhancements (V2+)
- Browser extension to save papers while browsing
- Email integration (send paper to email to add)
- Paper recommendations based on reading history
- Integration with ChatGPT/Claude for paper summaries
- Citation graph visualization
- Collaboration features
- Mobile apps
- API for third-party integrations

## Constraints & Requirements (From User)

### Hard Requirements
- Must use React + Next.js frontend
- Must use Railway for backend
- Must use Supabase for database
- Must use Python 3.12 with uv package manager
- Must use Tailwind CSS v3
- Must implement Google OAuth
- Must follow CODING_REPO_CONVENTIONS.md, CODING_RULES.md, UI_RULES.md
- Must set up pre-commit hooks

### Preferences
- Nice, simple, elegant UI like Goodreads
- Focus on simplicity for v1
- Single user initially

---

## Brain Dump Status
This brain dump captures the initial project context, requirements, and open questions. Before proceeding to specification writing, we need clarity on the questions above, particularly around authentication provider choice and the minimal viable scope for notes functionality.


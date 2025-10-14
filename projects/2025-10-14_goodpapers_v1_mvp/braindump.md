# Goodpapers - Brain Dump

## Project Vision
A Goodreads-style application for tracking academic papers, designed for personal use (single user initially). The goal is to provide a simple, elegant interface to manage reading progress, add notes, and organize research papers.

## Core User Story
"As a researcher, I want to easily track the papers I'm reading, add notes and comments, and quickly find papers I've previously worked with, so that I can better manage my research workflow."

## 🚀 MAJOR ARCHITECTURAL DECISION: Convex for Everything

**User has decided to use Convex as the ENTIRE backend**, replacing Railway, Supabase, and handling authentication. This dramatically simplifies the architecture!

### Why This Is Better
- **Single Backend Service**: Convex handles database, backend functions, auth, and file storage
- **Real-time by Default**: Built-in reactivity and live updates
- **TypeScript Throughout**: Both frontend and backend in TypeScript
- **Faster to Ship**: Less infrastructure to configure
- **Better DX**: Integrated deployment, automatic migrations, built-in file storage

## Finalized Tech Stack

### Frontend
- **Framework**: React + Next.js 15 (App Router)
- **Styling**: Tailwind CSS v3 (per project conventions)
- **Deployment**: Vercel

### Backend (ALL CONVEX)
- **Backend Platform**: Convex (replaces Railway + Supabase + Clerk)
- **Language**: TypeScript/JavaScript (NOT Python!)
- **Database**: Convex database (document-oriented, reactive)
- **Authentication**: Convex Auth with Google OAuth
- **File Storage**: Convex File Storage (for PDFs)
- **Backend Functions**: Convex queries, mutations, and actions

### Infrastructure
- **Pre-commit hooks**: To be set up per CODING_REPO_CONVENTIONS.md
- **Linting**: Prettier for JS/TS
- **Build verification**: Required in pre-commit hooks
- **Package Manager**: npm/pnpm for Node

## V1 MVP Feature Set (LOCKED FOR TODAY'S SHIP)

### 1. Authentication ✅
- [ ] Google OAuth integration (Convex Auth)
- [ ] Single user authentication (no multi-user support in v1, but database designed for future expansion)
- [ ] Session management (handled by Convex Auth)

### 2. Home Page ✅
- [ ] Google-like search bar in the center
- [ ] Autocomplete functionality for paper search (using Convex full-text search)
- [ ] Display last 10 modified papers (below search bar, before typing)
- [ ] "Add new paper" button (triggers modal/form)
- [ ] Clean, Goodreads-inspired UI with Tailwind CSS v3

### 3. Paper Addition Flow ✅
- [ ] Input field for ArXiv link (modal or dedicated page)
- [ ] Automatic paper download from ArXiv (using Convex HTTP action)
- [ ] Extract metadata from ArXiv API (title, authors, abstract, publication date, etc.)
- [ ] Store PDF file in Convex File Storage
- [ ] Create database entry for paper

### 4. Paper Reading & Annotation ✅
- [ ] PDF reader/viewer embedded in the app (react-pdf)
- [ ] Paper-level notes (markdown support)
- [ ] Save and display notes alongside paper
- [ ] Simple, clean interface for note-taking

### 5. Paper Management ✅
- [ ] View list of all papers
- [ ] Search across papers (title, authors, abstract, notes) using Convex full-text search
- [ ] Track reading status (To Read, Reading, Completed)
- [ ] Simple tags for organization
- [ ] Last modified timestamp tracking (automatic via Convex)

## Convex Architecture Details

### Database Schema Design

**Tables to Create:**

1. **`papers`** table:
```typescript
// convex/papers/schema.ts
export const papersFields = {
  arxivId: v.string(),          // ArXiv ID (e.g., "2403.05530")
  arxivUrl: v.string(),          // Full ArXiv URL
  title: v.string(),             // Paper title
  authors: v.array(v.string()),  // Array of author names
  abstract: v.string(),          // Paper abstract
  publicationDate: v.optional(v.string()), // Publication date from ArXiv
  pdfStorageId: v.id("_storage"), // Convex file storage ID for PDF
  readingStatus: v.union(
    v.literal("to_read"),
    v.literal("reading"),
    v.literal("completed")
  ),
  tags: v.optional(v.array(v.string())), // Array of tag strings
  userId: v.optional(v.id("users")), // For future multi-user support
};
```

2. **`notes`** table:
```typescript
// convex/notes/schema.ts
export const notesFields = {
  paperId: v.id("papers"),       // Foreign key to papers
  content: v.string(),           // Markdown content
  userId: v.optional(v.id("users")), // For future multi-user support
};
```

3. **`users`** table (minimal for now):
```typescript
// convex/users/schema.ts
export const usersFields = {
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
};
```

**Indexes to Define:**

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { papersFields } from "./papers/validators";
import { notesFields } from "./notes/validators";
import { usersFields } from "./users/validators";

export default defineSchema({
  papers: defineTable(papersFields)
    .index("by_arxiv_id", ["arxivId"])
    .index("by_user_modified", ["userId", "_creationTime"])
    .index("by_reading_status", ["userId", "readingStatus"])
    .searchIndex("search_content", {
      searchField: "title",
      filterFields: ["userId", "readingStatus"],
    })
    .searchIndex("search_authors", {
      searchField: "authors",
      filterFields: ["userId"],
    })
    .searchIndex("search_abstract", {
      searchField: "abstract",
      filterFields: ["userId"],
    }),
  
  notes: defineTable(notesFields)
    .index("by_paper", ["paperId"])
    .index("by_user", ["userId"])
    .searchIndex("search_notes", {
      searchField: "content",
      filterFields: ["userId", "paperId"],
    }),
  
  users: defineTable(usersFields)
    .index("by_email", ["email"]),
});
```

### Convex Functions Architecture

**Queries (Read Operations):**

1. `papers:list` - List papers with pagination
2. `papers:get` - Get single paper by ID
3. `papers:search` - Search papers using full-text search
4. `papers:getRecentlyModified` - Get last 10 modified papers
5. `notes:listByPaper` - Get all notes for a paper
6. `users:getCurrent` - Get current authenticated user

**Mutations (Write Operations):**

1. `papers:create` - Create new paper entry
2. `papers:update` - Update paper metadata/status
3. `papers:delete` - Delete paper
4. `papers:addTag` - Add tag to paper
5. `papers:removeTag` - Remove tag from paper
6. `notes:create` - Create new note
7. `notes:update` - Update existing note
8. `notes:delete` - Delete note
9. `users:upsert` - Create or update user (called on login)

**Actions (External API Calls):**

1. `papers:fetchFromArxiv` - Fetch paper metadata from ArXiv API
2. `papers:downloadPdf` - Download PDF from ArXiv and store in Convex
3. `papers:generateUploadUrl` - Generate upload URL for PDF (if direct upload)

**HTTP Actions (Public Endpoints):**

1. `GET /api/papers/pdf/:storageId` - Serve PDF files

### Convex Auth Setup

**Google OAuth Configuration:**

```typescript
// convex/auth.ts
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
});
```

**Environment Variables (Convex):**
```bash
# Set with: npx convex env set AUTH_GOOGLE_ID your_client_id
AUTH_GOOGLE_ID=<Google OAuth Client ID>
AUTH_GOOGLE_SECRET=<Google OAuth Client Secret>
```

**Google OAuth Setup Steps:**
1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `https://<your-deployment>.convex.site/api/auth/callback/google`
6. Copy Client ID and Secret to Convex environment

### Convex File Storage

**Uploading PDFs:**

```typescript
// convex/papers/actions.ts
export const downloadAndStorePdf = action({
  args: { arxivId: v.string() },
  returns: v.id("_storage"),
  handler: async (ctx, args) => {
    // Download PDF from ArXiv
    const pdfUrl = `https://arxiv.org/pdf/${args.arxivId}.pdf`;
    const response = await fetch(pdfUrl);
    const pdfBlob = await response.blob();
    
    // Store in Convex
    const storageId = await ctx.storage.store(pdfBlob);
    
    return storageId;
  },
});
```

**Serving PDFs:**

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/api/papers/pdf",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const storageId = url.searchParams.get("storageId");
    
    if (!storageId) {
      return new Response("Missing storageId", { status: 400 });
    }
    
    const blob = await ctx.storage.get(storageId);
    
    if (!blob) {
      return new Response("File not found", { status: 404 });
    }
    
    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
      },
    });
  }),
});

export default http;
```

### ArXiv API Integration

**ArXiv API Reference:**
- **API Base URL**: `http://export.arxiv.org/api/query`
- **PDF Download URL**: `https://arxiv.org/pdf/{arxiv_id}.pdf`
- **Metadata Endpoint**: Use API query with `id_list` parameter

**Example ArXiv API Query:**
```typescript
// Extract ArXiv ID from URL (e.g., "https://arxiv.org/abs/2403.05530" -> "2403.05530")
const arxivId = arxivUrl.split('/').pop()!;

// Fetch metadata
const metadataUrl = `http://export.arxiv.org/api/query?id_list=${arxivId}`;
const response = await fetch(metadataUrl);
const xmlText = await response.text();

// Parse XML to extract title, authors, abstract, published date
// (Will use XML parser in implementation)
```

### Full-Text Search Implementation

**Searching Papers:**

```typescript
// convex/papers/queries.ts
export const search = query({
  args: { 
    searchTerm: v.string(),
    userId: v.optional(v.id("users")),
  },
  returns: v.array(/* paper type */),
  handler: async (ctx, args) => {
    // Search across title, authors, and abstract
    const titleResults = await ctx.db
      .query("papers")
      .withSearchIndex("search_content", (q) =>
        q.search("title", args.searchTerm)
          .eq("userId", args.userId)
      )
      .take(10);
    
    // Combine and deduplicate results
    // Return ranked by relevance
  },
});
```

**Autocomplete Search:**
- Use Convex's typeahead search (prefix matching on last term)
- Search as user types in the search bar
- Return top 5-10 matches
- Show paper title + first author

## Frontend Architecture

### Key Components to Build

1. **Authentication:**
   - `app/layout.tsx` - Wrap with ConvexAuthNextjsProvider
   - `components/SignInButton.tsx` - Google OAuth button
   - `components/UserMenu.tsx` - User profile dropdown

2. **Home Page:**
   - `app/page.tsx` - Main home page
   - `components/SearchBar.tsx` - Search with autocomplete
   - `components/PapersList.tsx` - Display recent papers
   - `components/AddPaperButton.tsx` - Trigger add modal

3. **Paper Management:**
   - `app/papers/[id]/page.tsx` - Paper detail page
   - `components/PdfViewer.tsx` - PDF reader (react-pdf)
   - `components/NotesEditor.tsx` - Markdown notes editor
   - `components/PaperMetadata.tsx` - Display title, authors, abstract
   - `components/ReadingStatusSelector.tsx` - Dropdown for status
   - `components/TagsEditor.tsx` - Add/remove tags

4. **Modals/Forms:**
   - `components/AddPaperModal.tsx` - Input ArXiv URL
   - `components/EditPaperModal.tsx` - Edit metadata

### Convex Client Setup (Next.js)

```typescript
// app/ConvexClientProvider.tsx
"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
}
```

```typescript
// app/layout.tsx
import ConvexClientProvider from "./ConvexClientProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

### Using Convex in Components

```typescript
// Example: Display recent papers
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function RecentPapers() {
  const papers = useQuery(api.papers.getRecentlyModified);
  
  if (papers === undefined) return <div>Loading...</div>;
  
  return (
    <div>
      {papers.map((paper) => (
        <div key={paper._id}>
          <h3>{paper.title}</h3>
          <p>{paper.authors.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// Example: Add paper mutation
"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AddPaperForm() {
  const createPaper = useMutation(api.papers.create);
  
  const handleSubmit = async (arxivUrl: string) => {
    await createPaper({ arxivUrl });
  };
  
  return <form onSubmit={...}>...</form>;
}
```

## Project Structure

```
goodpapers/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with Convex provider
│   ├── page.tsx                  # Home page
│   ├── papers/
│   │   └── [id]/
│   │       └── page.tsx          # Paper detail page
│   └── ConvexClientProvider.tsx  # Convex auth provider
├── components/                    # React components
│   ├── SearchBar.tsx
│   ├── PapersList.tsx
│   ├── PdfViewer.tsx
│   ├── NotesEditor.tsx
│   ├── AddPaperModal.tsx
│   └── ...
├── convex/                        # Convex backend
│   ├── schema.ts                  # Database schema
│   ├── auth.ts                    # Convex Auth config
│   ├── http.ts                    # HTTP actions
│   ├── papers/
│   │   ├── validators.ts          # Paper field validators
│   │   ├── schema.ts              # Papers table definition
│   │   ├── queries.ts             # Paper queries
│   │   ├── mutations.ts           # Paper mutations
│   │   └── actions.ts             # ArXiv API actions
│   ├── notes/
│   │   ├── validators.ts
│   │   ├── schema.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── users/
│   │   ├── validators.ts
│   │   ├── schema.ts
│   │   └── queries.ts
│   └── _generated/                # Auto-generated by Convex
├── lib/                           # Utility functions
├── public/                        # Static assets
├── .env.local                     # Environment variables
├── convex.json                    # Convex config
├── next.config.js                 # Next.js config
├── tailwind.config.js             # Tailwind CSS v3 config
├── package.json
└── tsconfig.json
```

## Setup Steps (In Order)

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest goodpapers --typescript --tailwind --app --no-src-dir
cd goodpapers
```

### 2. Install Convex
```bash
npm install convex @convex-dev/auth
npx convex dev --configure=new
```

### 3. Set Up Convex Auth
```bash
npx @convex-dev/auth
# Follow prompts to set up Google OAuth
```

### 4. Configure Google OAuth
- Create Google Cloud Project
- Get OAuth credentials
- Set environment variables in Convex:
  ```bash
  npx convex env set AUTH_GOOGLE_ID <your_client_id>
  npx convex env set AUTH_GOOGLE_SECRET <your_client_secret>
  ```

### 5. Install Additional Dependencies
```bash
npm install react-pdf react-markdown react-mde
npm install -D @types/react-pdf
```

### 6. Create Schema and Functions
- Define schema in `convex/schema.ts`
- Implement queries, mutations, and actions
- Deploy: `npx convex deploy`

### 7. Build Frontend
- Create components
- Implement pages
- Add Tailwind styling

### 8. Deploy
```bash
# Frontend to Vercel
vercel deploy --prod

# Backend to Convex (automatic with npx convex dev)
npx convex deploy --prod
```

## Success Criteria

### User Experience Success
- ✅ Can authenticate with Google in < 30 seconds
- ✅ Can add a new ArXiv paper in < 15 seconds
- ✅ Can search and find a paper in < 5 seconds
- ✅ Can read and annotate a paper seamlessly
- ✅ UI feels polished and professional (like Goodreads)

### Technical Success
- ✅ All builds pass with no errors
- ✅ Pre-commit hooks enforce code quality (to be set up)
- ✅ Application loads in < 2 seconds
- ✅ PDF viewer loads papers in < 5 seconds
- ✅ Search returns results in < 1 second (Convex is fast!)
- ✅ Real-time updates work (Convex reactivity)

### Shipping Success (TODAY)
- ✅ **Polished MVP deployed to production**
- ✅ **You can start using it for your papers immediately**
- ✅ **Core features work end-to-end**
- ✅ **Clean, beautiful UI**

## Out of Scope for V1 (Future Enhancements)

- Multi-user support (architecture supports it, just not exposed)
- Paper recommendations
- Social features (sharing, commenting with others)
- Advanced PDF annotations (highlights, drawings, text selection)
- Mobile app
- Offline support
- Export functionality
- Integration with reference managers (Zotero, Mendeley)
- Citation management
- Multiple paper sources beyond ArXiv
- Advanced search filters and sorting
- Collections/shelves (like Goodreads)
- Browser extension
- Email integration
- AI-powered paper summaries
- Citation graph visualization

## Key Convex Advantages for This Project

1. **Real-time Updates**: When you add a note, it appears instantly
2. **No API Boilerplate**: Direct function calls from React
3. **Automatic Reactivity**: UI updates when data changes
4. **Built-in File Storage**: No need for S3 or separate storage
5. **TypeScript End-to-End**: Type safety from DB to UI
6. **Easy Auth**: Google OAuth works out of the box
7. **Fast Search**: Full-text search built-in
8. **Zero Backend Deployment**: Just push to Convex
9. **Generous Free Tier**: Perfect for personal projects
10. **Great DX**: Hot reload, instant deployment, excellent docs

## Timeline: Ship TODAY

**Total Time Estimate: 6-8 hours**

### Phase 1: Setup (30 min)
- [x] Initialize Next.js project
- [x] Install Convex
- [x] Set up Google OAuth
- [x] Configure environment

### Phase 2: Backend (2 hours)
- [ ] Define schema
- [ ] Implement paper queries/mutations
- [ ] Implement note queries/mutations
- [ ] ArXiv API integration action
- [ ] PDF download and storage action
- [ ] Search functionality
- [ ] HTTP action for serving PDFs

### Phase 3: Frontend Core (2 hours)
- [ ] Set up authentication flow
- [ ] Build home page with search
- [ ] Create paper list component
- [ ] Build add paper modal
- [ ] Implement basic styling with Tailwind

### Phase 4: Paper Detail Page (2 hours)
- [ ] PDF viewer component
- [ ] Notes editor component
- [ ] Paper metadata display
- [ ] Reading status selector
- [ ] Tags editor

### Phase 5: Polish & Deploy (1.5 hours)
- [ ] Refine UI/UX
- [ ] Add loading states
- [ ] Error handling
- [ ] Deploy to Vercel (frontend)
- [ ] Deploy to Convex (backend - automatic)
- [ ] Test end-to-end

### Phase 6: Testing & Fixes (30 min)
- [ ] Test with real ArXiv papers
- [ ] Fix any issues
- [ ] Final polish

## Questions Answered ✅

### 1. Authentication Provider
**DECISION**: Convex Auth with Google OAuth

### 2. Notes Functionality
**DECISION**: Paper-level notes with markdown support (simple, fast to ship)

### 3. Search Scope
**DECISION**: Titles + authors + abstracts + notes (using Convex full-text search)

### 4. Backend Framework
**DECISION**: Convex (TypeScript/JavaScript, NOT Python)

### 5. Reading Status Tracking
**DECISION**: Yes - To Read, Reading, Completed

### 6. Tags
**DECISION**: Yes - Simple tag array on papers

### 7. Frontend Deployment
**DECISION**: Vercel

### 8. Database Design
**DECISION**: Design for future multi-user (include userId fields, but V1 is single-user)

### 9. PDF Reader
**DECISION**: react-pdf (lightweight, good enough for V1)

### 10. Timeline
**DECISION**: Ship TODAY with polished MVP

## Convex Resources Used

- **Convex Docs**: https://docs.convex.dev
- **Convex Auth**: https://labs.convex.dev/auth
- **Convex Examples**: https://github.com/get-convex/convex-demos
- **Convex + Next.js**: https://docs.convex.dev/client/react/nextjs
- **Full-Text Search**: https://docs.convex.dev/search/text-search
- **File Storage**: https://docs.convex.dev/file-storage

## Environment Variables

### `.env.local` (Next.js)
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Convex Environment (set with `npx convex env set`)
```bash
AUTH_GOOGLE_ID=<your_google_client_id>
AUTH_GOOGLE_SECRET=<your_google_client_secret>
```

## Brain Dump Status

**STATUS**: ✅ APPROVED & READY FOR IMPLEMENTATION

All questions answered. Architecture finalized. Ready to build and ship TODAY.

**Next Step**: Create specification document and begin implementation following PROJECT_PLANNING_EXECUTION_OUTLINE.md


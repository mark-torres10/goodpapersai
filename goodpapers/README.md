# Goodpapers - Academic Paper Reading Tracker

A Goodreads-style application for tracking academic papers. Add ArXiv papers with one click, read PDFs in-browser, take notes, and search your library.

## Project Status

**Phase**: Setup Complete (PER-8) ✅  
**Next**: Convex Configuration Required (Interactive)  
**Linear Project**: https://linear.app/metresearch/project/goodpapers-v1-mvp-academic-paper-reading-tracker-92ca77070efe

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS v3
- **Backend**: Convex (database, auth, file storage, functions)
- **Auth**: Convex Auth with Google OAuth
- **PDF**: react-pdf library
- **Deployment**: Vercel (frontend), Convex (backend)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Google Cloud Console access
- Convex account (create at https://dashboard.convex.dev)

### 1. Convex Setup (Required - Interactive)

The Convex CLI requires interactive setup:

```bash
# From the goodpapers/ directory
npx convex dev --configure=new
```

This will:
- Prompt you to login/create Convex account
- Create a new Convex project
- Generate `.env.local` with `NEXT_PUBLIC_CONVEX_URL`
- Create `convex/_generated/` folder with TypeScript types

### 2. Set up Convex Auth

```bash
npx @convex-dev/auth
```

This creates `convex/auth.ts` and authentication infrastructure.

### 3. Configure Google OAuth

**In Google Cloud Console:**
1. Go to https://console.cloud.google.com
2. Create new project: "Goodpapers"
3. Enable "Google+ API" (APIs & Services → Library)
4. Create OAuth 2.0 Client ID (APIs & Services → Credentials):
   - Type: Web application
   - Name: "Goodpapers"
   - Authorized redirect URI: `https://[your-deployment].convex.site/api/auth/callback/google`
     (Get exact URL from Convex dashboard after setup)
5. Copy Client ID and Secret

**Configure in Convex:**
```bash
npx convex env set AUTH_GOOGLE_ID <your_client_id>
npx convex env set AUTH_GOOGLE_SECRET <your_client_secret>
```

### 4. Verify Setup

```bash
# Terminal 1: Run Convex
npx convex dev

# Terminal 2: Run Next.js
npm run dev
```

Visit http://localhost:3000 - should see Next.js app.

## Development

### Running Locally

```bash
# Terminal 1: Convex (backend)
npx convex dev

# Terminal 2: Next.js (frontend)
npm run dev
```

### Building for Production

```bash
npm run build
```

## Dependencies

**Core:**
- `next` - Next.js 15 framework
- `react` - React 19
- `react-dom` - React DOM
- `convex` - Convex backend client
- `@convex-dev/auth` - Convex authentication

**Libraries:**
- `react-pdf` - PDF viewing
- `react-markdown` - Markdown rendering
- `fast-xml-parser` - ArXiv XML parsing

**Dev Dependencies:**
- `typescript` - Type checking
- `tailwindcss` - Styling
- `@types/react-pdf` - PDF type definitions

## Project Structure

```
goodpapers/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── convex/                 # Convex backend
│   ├── auth.ts            # Auth configuration
│   └── _generated/        # Auto-generated types
├── components/            # React components (to be created)
├── lib/                   # Utility functions (to be created)
├── public/                # Static assets
├── .env.local            # Environment variables (gitignored)
├── convex.json           # Convex configuration
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind CSS v3 configuration
└── tsconfig.json         # TypeScript configuration
```

## Next Steps (After Convex Setup)

1. **PER-9**: Backend Schema & Core Functions (2.5-3 hrs) ⚡ Can run parallel
2. **PER-10**: ArXiv API Integration (2 hrs) ⚡ Can run parallel
3. **PER-11**: Frontend Auth & Layout (1.5 hrs)
4. **PER-12**: Home Page with Search (2.5 hrs)
5. **PER-13**: Paper Detail Page (2.5 hrs)
6. **PER-14**: Polish & Deploy (2.5 hrs)
7. **PER-15**: Testing & Launch (1.5 hrs)

## Documentation

Full project documentation available in:
`/Users/mark/Documents/work/goodpapers/projects/2025-10-14_goodpapers_v1_mvp/`

- `spec.md` - Technical specification
- `plan_goodpapers_v1.md` - Implementation plan
- `EXPERT_REVIEWS.md` - Expert persona reviews

## Resources

- **Convex Docs**: https://docs.convex.dev
- **Convex Auth**: https://labs.convex.dev/auth
- **Next.js Docs**: https://nextjs.org/docs
- **ArXiv API**: https://arxiv.org/help/api

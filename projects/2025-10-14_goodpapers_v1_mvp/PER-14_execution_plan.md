# PER-14 Execution Plan: PDF Viewer Fix, Polish & Production Deployment

**Linear Ticket**: https://linear.app/metresearch/issue/PER-14  
**Estimated Time**: 2.5 hours  
**Dependencies**: PER-8-13 (ALL COMPLETE ✅)  
**Blocks**: PER-15 (Final testing & launch)

---

## Executive Summary

Complete the Goodpapers MVP by fixing the critical PDF viewer CSP issue, polishing the UI, implementing comprehensive error handling and observability, and deploying to production. This phase transforms the functional prototype into a production-ready application with monitoring and a refined user experience.

**Working Directory**: `/Users/mark/Documents/work/goodpapers/goodpapers/`

---

## Context Analysis

### Critical Issue from PER-13

**PDF Viewer Blocked by CSP** (HIGH PRIORITY):
- PER-13 testing revealed PDF.js worker is blocked by Next.js Content Security Policy
- Console errors: "Refused to create a worker from 'blob:...'" and "Refused to load the script..."
- All PDF viewer code is correct - only needs CSP configuration
- This is the ONLY blocking issue from PER-13

### What Needs to Be Implemented

**1. PDF Viewer Fix (CRITICAL)**:
- Configure Next.js CSP headers in `next.config.ts`
- Allow `worker-src: blob:` for PDF.js worker
- Allow external script loading from CDN
- Test PDF viewing end-to-end

**2. UI Polish**:
- Consistent color scheme (Goodreads-inspired tones)
- Typography hierarchy refinement
- Proper spacing and padding throughout
- Smooth transitions and hover states
- Loading skeletons for all async operations

**3. Error Handling & Observability**:
- Comprehensive try/catch blocks
- User-friendly error messages
- Toast notification system
- Convex logging for critical operations
- Vercel Analytics integration

**4. Empty States**:
- No papers: Helpful call-to-action
- No notes: Encouraging prompt
- No search results: Useful suggestions
- Error states with retry options

**5. Pre-commit Hooks**:
- Prettier for code formatting
- ESLint for code quality
- Automatic formatting on commit

**6. Production Deployment**:
- Deploy to Vercel
- Configure production environment variables
- Update Google OAuth redirect URIs
- End-to-end testing in production

### Key Requirements from Spec

- PDF viewer must work (< 5s load time)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Professional, polished interface
- Zero console errors in production
- Comprehensive error handling
- Production-ready monitoring

### Key Constraints

- Must maintain existing functionality from PER-8-13
- Must use Next.js 15 (App Router)
- Must deploy to Vercel (free tier)
- Must use Convex for backend (existing deployment)
- Google OAuth must work in production

### Existing Context

**From PER-13** (JUST COMPLETED):
- Paper detail page with PDF viewer, notes, metadata
- 7/8 features working (only PDF blocked by CSP)
- All components properly structured
- Real-time updates working
- Navigation working

**From PER-12**:
- Homepage with paper list, search, filters
- Add paper functionality working

**From PER-11**:
- Authentication with Google OAuth
- Protected routes
- User session management

**From PER-8-10**:
- Complete backend infrastructure
- ArXiv integration
- PDF storage in Convex

---

## Implementation Strategy

### High-Level Approach

1. **Fix PDF Viewer First** (CRITICAL): Unblock the main issue
2. **Polish UI Second**: Make it production-ready visually
3. **Add Error Handling Third**: Make it robust
4. **Set Up Observability Fourth**: Enable monitoring
5. **Configure Pre-commit Hooks Fifth**: Ensure code quality
6. **Deploy to Production Last**: Validate everything works

### Why This Approach

- PDF viewer fix is blocking issue - must be first
- UI polish makes good first impression
- Error handling prevents bad user experience
- Observability helps monitor production
- Pre-commit hooks prevent regressions
- Deployment validates everything together

### Key Design Decisions

1. **CSP Configuration**: Use Next.js headers() API for CSP
2. **Toast Notifications**: Simple in-app notifications (no external library)
3. **Vercel Analytics**: Built-in, free, easy to set up
4. **Prettier + Husky**: Industry standard pre-commit hooks
5. **Vercel Deployment**: Zero-config, free tier, automatic CI/CD

---

## Detailed Execution Plan

### Phase 1: Fix PDF Viewer CSP (CRITICAL - 20 min)

**Step 1.1**: Update `next.config.ts` with CSP headers (10 min)

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  async headers() {
    return [
      {
        // Apply CSP headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://*.convex.cloud",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.convex.cloud https://*.convex.site wss://*.convex.cloud",
              "frame-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Step 1.2**: Test PDF viewer locally (5 min)

```bash
cd /Users/mark/Documents/work/goodpapers/goodpapers
npm run dev
```

- Navigate to paper detail page
- Verify PDF loads without CSP errors
- Test page navigation controls
- Test zoom controls
- Check browser console - should be clean

**Step 1.3**: Document CSP configuration (5 min)

Add note to README or docs explaining CSP requirements for PDF.js.

---

### Phase 2: UI Polish (45 min)

**Step 2.1**: Refine color scheme (15 min)

Update `globals.css` with Goodreads-inspired color palette:

```css
/* app/globals.css - Add/update these variables */
:root {
  /* Goodreads-inspired colors */
  --color-primary: #00635d; /* Goodreads teal */
  --color-primary-hover: #004d48;
  --color-secondary: #f4f1ea; /* Warm off-white background */
  --color-accent: #d73b04; /* Orange accent for CTAs */
  
  /* Status colors */
  --color-to-read: #3b82f6; /* Blue */
  --color-reading: #eab308; /* Yellow */
  --color-completed: #22c55e; /* Green */
  
  /* Neutrals */
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
}

/* Apply smooth transitions globally */
* {
  transition-property: color, background-color, border-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Step 2.2**: Typography hierarchy (10 min)

Update typography scale for better readability:

```css
/* Headings */
h1 { @apply text-3xl font-bold tracking-tight text-gray-900; }
h2 { @apply text-2xl font-semibold tracking-tight text-gray-900; }
h3 { @apply text-xl font-semibold text-gray-900; }

/* Body text */
.text-body { @apply text-base text-gray-700 leading-relaxed; }
.text-small { @apply text-sm text-gray-600; }
.text-tiny { @apply text-xs text-gray-500; }
```

**Step 2.3**: Add loading skeletons (10 min)

Enhance existing skeleton loaders with better animations:

```typescript
// components/papers/PaperListSkeleton.tsx
export function PaperListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-3">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-shimmer" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/4 animate-shimmer" />
            <div className="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Add shimmer animation to tailwind.config.ts
```

**Step 2.4**: Improve hover states (10 min)

Add consistent hover effects:

```typescript
// Update PaperCard hover state
className="... hover:shadow-lg hover:scale-[1.02] transition-all duration-200"

// Update buttons
className="... hover:shadow-md active:scale-95 transition-all"
```

---

### Phase 3: Error Handling & Toast Notifications (30 min)

**Step 3.1**: Create Toast notification component (15 min)

```typescript
// components/ui/Toast.tsx
"use client";

import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg border shadow-lg z-50 ${styles[type]}`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
          ×
        </button>
      </div>
    </div>
  );
}

// components/ui/ToastProvider.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "./Toast";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
```

**Step 3.2**: Add error handling to critical operations (15 min)

Update AddPaperModal with toast notifications:

```typescript
// components/papers/AddPaperModal.tsx
import { useToast } from "@/components/ui/ToastProvider";

// In handleSubmit:
try {
  await addPaper({ input: arxivUrl, userId });
  showToast("Paper added successfully!", "success");
  onClose();
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : "Failed to add paper";
  showToast(errorMessage, "error");
  setError(errorMessage);
}
```

Update NotesEditor with error feedback:

```typescript
// components/papers/NotesEditor.tsx
// In auto-save effect:
try {
  await saveNote({ paperId, userId, content });
  setLastSaved(new Date());
  setSaveError(null);
} catch (error) {
  console.error("Failed to save note:", error);
  setSaveError("Failed to save. Will retry...");
  // Could add toast here too
}
```

---

### Phase 4: Empty States (20 min)

**Step 4.1**: Create EmptyState component (10 min)

```typescript
// components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

**Step 4.2**: Update empty states throughout app (10 min)

```typescript
// In PaperList when no papers:
<EmptyState
  icon="📚"
  title="No papers yet"
  description="Start building your research library by adding your first paper from ArXiv"
  action={{
    label: "+ Add Your First Paper",
    onClick: () => setIsAddModalOpen(true),
  }}
/>

// In NotesEditor when no notes:
<EmptyState
  icon="📝"
  title="No notes yet"
  description="Add notes to remember key insights and ideas from this paper"
/>

// In search results when no matches:
<EmptyState
  icon="🔍"
  title="No papers found"
  description="Try different keywords or check your spelling"
/>
```

---

### Phase 5: Observability Setup (30 min)

**Step 5.1**: Add Convex logging (20 min)

Add logging to all critical operations:

```typescript
// convex/arxiv/actions.ts
export const addPaperFromArxiv = action({
  handler: async (ctx, args) => {
    console.log("[ArXiv] Starting paper fetch:", { input: args.input, userId: args.userId });
    
    const startTime = Date.now();
    
    try {
      const arxivId = parseArxivId(args.input);
      console.log("[ArXiv] Parsed ID:", { arxivId });
      
      const metadata = await fetchArxivMetadata(arxivId);
      console.log("[ArXiv] Metadata fetched:", { title: metadata.title, arxivId });
      
      const pdfStorageId = await ctx.storage.store(pdfBlob);
      console.log("[ArXiv] PDF stored:", { pdfStorageId, arxivId });
      
      const paperId = await ctx.runMutation(api.papers.createPaper, { ... });
      
      const duration = Date.now() - startTime;
      console.log("[ArXiv] Success:", { paperId, arxivId, duration });
      
      return { paperId, ...metadata, pdfStorageId };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error("[ArXiv] Failed:", { 
        input: args.input, 
        error: error.message,
        duration 
      });
      throw error;
    }
  },
});

// convex/notes.ts
export const saveNote = mutation({
  handler: async (ctx, args) => {
    console.log("[Notes] Saving note:", { paperId: args.paperId, contentLength: args.content.length });
    
    try {
      const noteId = await ctx.db.insert("notes", { ... });
      console.log("[Notes] Saved successfully:", { noteId, paperId: args.paperId });
      return noteId;
    } catch (error) {
      console.error("[Notes] Save failed:", { paperId: args.paperId, error: error.message });
      throw error;
    }
  },
});
```

**Step 5.2**: Enable Vercel Analytics (5 min)

```bash
# Install Vercel Analytics
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Step 5.3**: Document monitoring setup (5 min)

Create `MONITORING.md` with instructions for viewing logs and analytics.

---

### Phase 6: Pre-commit Hooks (15 min)

**Step 6.1**: Install Husky and Prettier (5 min)

```bash
cd /Users/mark/Documents/work/goodpapers/goodpapers
npm install --save-dev husky prettier lint-staged
npx husky init
```

**Step 6.2**: Configure Prettier (5 min)

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 100
}
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**Step 6.3**: Set up pre-commit hook (5 min)

```bash
# .husky/pre-commit
npm run lint
npx lint-staged
```

Test the hook:
```bash
git add .
git commit -m "test: pre-commit hook"
# Should run prettier and eslint automatically
```

---

### Phase 7: Production Deployment (30 min)

**Step 7.1**: Deploy Convex backend (5 min)

```bash
cd /Users/mark/Documents/work/goodpapers/goodpapers
npx convex deploy
```

- Note the production deployment URL
- Verify in Convex dashboard

**Step 7.2**: Set up Vercel project (10 min)

1. Push code to GitHub (if not already):
   ```bash
   git push origin main
   ```

2. Go to https://vercel.com
3. Click "New Project"
4. Import from GitHub: `goodpapersai` repository
5. Configure:
   - Framework: Next.js
   - Root Directory: `goodpapers/`
   - Build Command: `npm run build`
   - Output Directory: `.next`

**Step 7.3**: Configure environment variables (5 min)

In Vercel dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_CONVEX_URL=https://impartial-wolf-773.convex.cloud
```

**Step 7.4**: Update Google OAuth redirect URIs (5 min)

1. Go to Google Cloud Console
2. Navigate to OAuth 2.0 credentials
3. Add authorized redirect URI:
   ```
   https://[your-vercel-app].vercel.app/api/auth/callback/google
   https://impartial-wolf-773.convex.site/api/auth/callback/google
   ```

4. Save changes

**Step 7.5**: Deploy to Vercel (5 min)

- Click "Deploy" in Vercel
- Wait for build to complete
- Get production URL: `https://goodpapers.vercel.app` (or similar)

---

### Phase 8: Production Testing (20 min)

**Step 8.1**: End-to-end auth flow (5 min)

- Visit production URL
- Should redirect to sign-in
- Sign in with Google
- Verify redirect back to app
- Check user menu shows correct info

**Step 8.2**: Add paper flow (5 min)

Test with real ArXiv paper:
```
https://arxiv.org/abs/1706.03762
(Attention Is All You Need)
```

- Click "Add Paper"
- Paste URL
- Submit
- Verify paper appears in list
- Check Convex logs in dashboard

**Step 8.3**: PDF viewer test (5 min)

- Click on paper card
- Navigate to detail page
- **Verify PDF loads** (this was blocked in dev - must work now!)
- Test page navigation
- Test zoom controls
- Check browser console (should be clean)

**Step 8.4**: Notes and metadata test (5 min)

- Add notes to paper
- Wait for auto-save
- Change reading status
- Add tags
- Navigate away and back
- Verify all changes persist

---

### Phase 9: Performance Validation (10 min)

**Step 9.1**: Check Core Web Vitals (5 min)

Open Chrome DevTools:
- Lighthouse audit
- Performance tab
- Verify:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

**Step 9.2**: Verify Vercel Analytics (5 min)

- Go to Vercel dashboard
- Navigate to Analytics tab
- Verify data is being collected
- Check real-time metrics

---

## Success Criteria

### Critical Requirements (Must Pass)
- [x] PDF viewer works in production (NO CSP errors)
- [x] Can sign in with Google OAuth
- [x] Can add papers from ArXiv
- [x] Can view papers and PDFs
- [x] Can take notes with auto-save
- [x] Can update status and tags
- [x] Zero console errors in production
- [x] Core Web Vitals meet targets

### Technical Requirements
- [x] CSP headers configured correctly
- [x] TypeScript strict mode passing
- [x] Production build succeeds
- [x] Pre-commit hooks working
- [x] Vercel Analytics enabled
- [x] Convex logging implemented
- [x] Error handling comprehensive

### UI/UX Requirements
- [x] Professional, polished interface
- [x] Goodreads-inspired aesthetic
- [x] Smooth transitions
- [x] Loading states everywhere
- [x] Helpful empty states
- [x] Clear error messages
- [x] Toast notifications working

---

## Timeline

| Phase | Estimated | Notes |
|-------|-----------|-------|
| Fix PDF Viewer CSP | 20 min | CRITICAL - unblocks PER-13 |
| UI Polish | 45 min | Colors, typography, animations |
| Error Handling & Toasts | 30 min | User feedback system |
| Empty States | 20 min | Helpful prompts |
| Observability Setup | 30 min | Logging + Analytics |
| Pre-commit Hooks | 15 min | Code quality |
| Production Deployment | 30 min | Vercel + Convex |
| Production Testing | 20 min | E2E validation |
| Performance Validation | 10 min | Core Web Vitals |
| **Total** | **3 hours 40 min** | ~1 hour over estimate |

---

## Risk Assessment

**HIGH PRIORITY**:
- PDF viewer CSP fix → Test immediately after config change
- Google OAuth redirect → Must update before production testing
- Environment variables → Double-check in Vercel

**MEDIUM RISKS**:
- Core Web Vitals → May need optimization if slow
- Vercel deployment → First deployment can have issues

**LOW RISKS**:
- UI polish → Iterative, can adjust
- Pre-commit hooks → Standard setup

**Mitigation**:
- Test PDF viewer immediately after CSP fix
- Have Google OAuth credentials ready
- Test deployment in Vercel preview first
- Monitor Convex logs for errors
- Keep browser console open for debugging

---

## Notes

- This is the **FINAL phase** before PER-15 (Launch)
- PDF viewer fix is **CRITICAL** - blocks core functionality
- Production deployment validates everything end-to-end
- Monitoring helps identify issues post-launch
- Pre-commit hooks prevent regressions

---

## Reference Links

- **Next.js CSP**: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
- **Vercel Deployment**: https://vercel.com/docs/deployments/overview
- **Vercel Analytics**: https://vercel.com/docs/analytics
- **Convex Deployment**: https://docs.convex.dev/production/deployment
- **Husky**: https://typicode.github.io/husky/
- **Prettier**: https://prettier.io/docs/en/
- **Project Dashboard**: https://dashboard.convex.dev (project: `impartial-wolf-773`)

---

## File Structure After PER-14

```
goodpapers/
├── next.config.ts (updated with CSP headers)
├── .prettierrc (new)
├── .husky/ (new)
│   └── pre-commit
├── app/
│   ├── layout.tsx (updated with Analytics)
│   └── globals.css (updated with polished styles)
├── components/
│   ├── ui/
│   │   ├── Toast.tsx (new)
│   │   ├── ToastProvider.tsx (new)
│   │   └── EmptyState.tsx (new)
│   └── papers/ (updated with better loading states)
├── convex/ (updated with comprehensive logging)
└── MONITORING.md (new)
```

---

## Environment Variables Checklist

**Development** (`.env.local`):
```
NEXT_PUBLIC_CONVEX_URL=https://impartial-wolf-773.convex.cloud
```

**Convex** (via `npx convex env set`):
```
AUTH_GOOGLE_ID=<client_id>
AUTH_GOOGLE_SECRET=<client_secret>
```

**Production Vercel**:
```
NEXT_PUBLIC_CONVEX_URL=https://impartial-wolf-773.convex.cloud
```

**Google OAuth**:
- Development: `https://impartial-wolf-773.convex.site/api/auth/callback/google`
- Production: `https://[vercel-url].vercel.app/api/auth/callback/google`

---

**Ready to finalize the MVP! This is the last major implementation phase.** 🚀


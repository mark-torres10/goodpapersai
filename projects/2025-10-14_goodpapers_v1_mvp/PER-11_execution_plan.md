# PER-11 Execution Plan: Frontend Auth & Core Layout

**Linear Ticket**: https://linear.app/metresearch/issue/PER-11  
**Estimated Time**: 1.5 hours  
**Dependencies**: PER-8 (COMPLETE ✅), PER-9 (COMPLETE ✅), PER-10 (COMPLETE ✅)  
**Blocks**: PER-12, PER-13, PER-14, PER-15

---

## Executive Summary

Implement complete frontend authentication using Convex Auth with Google OAuth, create the core application layout with navigation, and establish the protected route structure. This phase transforms the basic setup from PER-8 into a fully functional authenticated application with proper session management and user interface foundation.

**Working Directory**: `/Users/mark/Documents/work/goodpapers/goodpapers/`

---

## Context Analysis

### What Needs to Be Implemented

**Authentication Flow**:
1. Upgrade ConvexClientProvider to use ConvexAuthNextjsProvider
2. Create sign-in page with Google OAuth button
3. Implement sign-out functionality
4. Add session persistence and validation
5. Create protected route wrapper
6. Display user profile information

**Core Layout**:
1. Update root layout with proper font optimization (next/font)
2. Create header/navigation component
3. Implement user menu dropdown
4. Add responsive design structure
5. Apply Goodreads-inspired styling

**User Experience**:
1. Smooth OAuth redirect flow
2. Loading states during authentication
3. Error handling for auth failures
4. Session persistence across page reloads
5. Clean, professional UI

### Key Requirements from Spec

- Google OAuth authentication (< 30s to authenticate)
- Session management with Convex Auth
- User profile display (name, email, avatar)
- Protected routes (redirect unauthenticated users)
- Responsive layout with Tailwind CSS
- Font optimization with next/font (Inter)
- Goodreads-inspired aesthetic
- Zero hydration errors

### Key Constraints

- Must use Convex Auth (not NextAuth or other libraries)
- Must use ConvexAuthNextjsProvider for proper SSR support
- Must handle "use client" directives correctly (avoid hydration issues)
- Must configure Google OAuth credentials in Convex dashboard
- Must preserve existing backend integration from PER-9/PER-10
- Must use Server Components where possible, Client Components only when needed

### Existing Context

**From PER-8**:
- Basic ConvexProvider already in `app/ConvexClientProvider.tsx`
- Root layout at `app/layout.tsx` with Inter font
- Auth infrastructure at `convex/auth.ts` (Google OAuth provider configured)
- HTTP routes at `convex/http.ts` (auth routes already added)

**From PER-9**:
- `users` table in schema with name, email, image fields
- User creation/lookup will be handled by Convex Auth automatically

**From PER-10**:
- ArXiv integration actions ready for frontend use
- PDF serving HTTP route ready for react-pdf viewer

**What Needs Upgrading from PER-8**:
- ConvexClientProvider needs upgrade to ConvexAuthNextjsProvider
- Root layout needs proper error boundary and metadata
- Need to create actual authentication UI components

---

## Implementation Strategy

### High-Level Approach

1. **Configure Google OAuth First**: Get credentials and configure in Convex
2. **Upgrade Provider Second**: Switch to ConvexAuthNextjsProvider
3. **Build Auth UI Third**: Sign-in page and components
4. **Create Layout Fourth**: Header, navigation, user menu
5. **Test Auth Flow Last**: Verify sign-in, sign-out, session persistence

### Why This Approach

- OAuth credentials must exist before testing auth flow
- Provider upgrade enables all auth hooks and components
- Auth UI depends on working provider
- Layout depends on auth state (show/hide elements based on user)
- Testing validates the complete integration

### Key Design Decisions

1. **Convex Auth over NextAuth**: Tighter integration, simpler setup, better DX
2. **ConvexAuthNextjsProvider for SSR**: Prevents hydration errors, better performance
3. **Separate sign-in page**: Cleaner UX than inline modal
4. **Server Components for layout**: Better performance, smaller bundle
5. **Client Components for auth**: Required for useAuthActions, Authenticated hooks
6. **Single OAuth provider**: Google only (simplest for single-user MVP)

---

## Detailed Execution Plan

### Phase 0: Google OAuth Configuration (15 min)

**Step 0.1**: Create Google OAuth credentials (10 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing: "Goodpapers"
3. Enable Google OAuth API
4. Create OAuth 2.0 credentials (Web application)
5. Configure authorized redirect URIs:
   - Development: `https://impartial-wolf-773.convex.site/api/auth/callback/google`
   - Production: `https://[your-domain].vercel.app/api/auth/callback/google`
6. Copy Client ID and Client Secret

**Step 0.2**: Configure credentials in Convex (5 min)

```bash
cd /Users/mark/Documents/work/goodpapers/goodpapers
npx convex env set AUTH_GOOGLE_ID <your_client_id>
npx convex env set AUTH_GOOGLE_SECRET <your_client_secret>
```

- Verify in Convex dashboard → Settings → Environment Variables
- Both variables should be listed (values hidden)

---

### Phase 1: Upgrade Authentication Provider (20 min)

**Step 1.1**: Update `app/ConvexClientProvider.tsx` (10 min)

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

**Step 1.2**: Verify no hydration errors (5 min)

```bash
npm run dev
```

- Open http://localhost:3000
- Check browser console for hydration warnings
- Should see no errors (provider handles SSR correctly)

**Step 1.3**: Test provider upgrade (5 min)

Create a quick test component to verify auth hooks work:

```typescript
// app/test-auth.tsx (temporary, delete later)
"use client";

import { useAuthActions } from "@convex-dev/auth/react";

export default function TestAuth() {
  const { signIn } = useAuthActions();
  
  return (
    <button onClick={() => signIn("google")}>
      Test Google Sign In
    </button>
  );
}
```

- Add to homepage temporarily
- Click button
- Should redirect to Google OAuth
- Remove test component after verification

---

### Phase 2: Sign-In Page & Components (30 min)

**Step 2.1**: Create sign-in page (15 min)

```typescript
// app/sign-in/page.tsx
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Goodpapers
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your academic paper reading tracker
          </p>
        </div>
        
        <SignInForm />
      </div>
    </div>
  );
}
```

**Step 2.2**: Create SignInForm component (15 min)

```typescript
// components/auth/SignInForm.tsx
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="group relative flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center">
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isLoading ? "Signing in..." : "Continue with Google"}
        </span>
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        Single sign-on with your Google account
      </p>
    </div>
  );
}
```

---

### Phase 3: Protected Routes & Auth State (20 min)

**Step 3.1**: Create auth wrapper component (10 min)

```typescript
// components/auth/ProtectedRoute.tsx
"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>

      <Authenticated>{children}</Authenticated>
    </>
  );
}

function RedirectToSignIn() {
  const router = useRouter();

  useEffect(() => {
    router.push("/sign-in");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-600">Redirecting to sign in...</p>
    </div>
  );
}
```

**Step 3.2**: Update homepage to use protected routes (5 min)

```typescript
// app/page.tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50">
        <h1 className="p-8 text-2xl font-bold">
          Welcome to Goodpapers
        </h1>
        {/* Home page content will be added in PER-12 */}
      </main>
    </ProtectedRoute>
  );
}
```

**Step 3.3**: Test protected route flow (5 min)

- Navigate to http://localhost:3000
- Should redirect to /sign-in if not authenticated
- Sign in with Google
- Should redirect back to homepage
- Refresh page → should stay authenticated

---

### Phase 4: Header & Navigation (25 min)

**Step 4.1**: Create Header component (15 min)

```typescript
// components/layout/Header.tsx
"use client";

import { Authenticated } from "convex/react";
import { UserMenu } from "@/components/auth/UserMenu";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <span>📚</span>
          <span>Goodpapers</span>
        </Link>

        {/* User Menu */}
        <Authenticated>
          <UserMenu />
        </Authenticated>
      </div>
    </header>
  );
}
```

**Step 4.2**: Create UserMenu component (10 min)

```typescript
// components/auth/UserMenu.tsx
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { signOut } = useAuthActions();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get current user info (will be available via Convex Auth)
  const user = useQuery(api.users.getCurrentUser);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {user?.image && (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="h-8 w-8 rounded-full"
          />
        )}
        <span>{user?.name || "User"}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### Phase 5: User Query Function (10 min)

**Step 5.1**: Add getCurrentUser query to existing schema (10 min)

We need to add a query to get the current authenticated user. This will be added to a new or existing users file:

```typescript
// convex/users.ts
import { query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Get the currently authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get user ID from auth session
    const userId = await auth.getUserId(ctx);
    
    if (!userId) {
      return null;
    }

    // Get user from database
    const user = await ctx.db.get(userId);
    return user;
  },
});

/**
 * Get or create user (called by auth flow)
 */
export const getOrCreateUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    
    // User will be created by Convex Auth automatically
    // This query just returns it
    return user;
  },
});
```

---

### Phase 6: Layout Integration (20 min)

**Step 6.1**: Update root layout with Header (10 min)

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Goodpapers - Academic Paper Reading Tracker",
  description: "Track, organize, and annotate your academic paper reading like Goodreads for research papers.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

**Step 6.2**: Create layout wrapper for authenticated pages (10 min)

```typescript
// components/layout/AppLayout.tsx
import { Header } from "./Header";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
```

**Step 6.3**: Update homepage to use AppLayout (5 min)

```typescript
// app/page.tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Papers
          </h1>
          
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-600">
              Your paper library will appear here.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              PER-12: Home Page coming next!
            </p>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
```

---

### Phase 7: Testing & Validation (15 min)

**Step 7.1**: End-to-end auth flow testing (10 min)

Test the complete authentication flow:

1. **Initial state** (not authenticated):
   - Navigate to http://localhost:3000
   - Should redirect to /sign-in
   - Sign-in page displays correctly

2. **Sign-in flow**:
   - Click "Continue with Google"
   - OAuth popup/redirect appears
   - Authorize the application
   - Redirected back to homepage (authenticated)
   - User name and avatar appear in header

3. **Session persistence**:
   - Refresh the page
   - Should stay authenticated (no redirect)
   - User info still displays

4. **Sign-out flow**:
   - Click user menu
   - Click "Sign out"
   - Redirected to /sign-in
   - User info cleared

5. **Protected routes**:
   - Try accessing / while signed out
   - Should redirect to /sign-in
   - Sign in
   - Should redirect back to /

**Step 7.2**: Browser console verification (5 min)

- Check for hydration errors: None expected ✅
- Check for console errors: None expected ✅
- Verify network requests:
  - Auth token stored in localStorage/cookies
  - API calls include authentication
- Check responsive design (desktop + mobile)

**Step 7.3**: Build verification (5 min)

```bash
npm run build
```

- Should build with no errors
- Check bundle size (should be reasonable)
- Verify all auth components are client-side bundled correctly

---

### Phase 8: Documentation (10 min)

**Step 8.1**: Create auth documentation (10 min)

Create `components/auth/README.md`:

```markdown
# Authentication Components

## Overview

Goodpapers uses Convex Auth with Google OAuth for authentication.

## Components

### SignInForm
Client component for Google OAuth sign-in.

**Usage**:
```tsx
import { SignInForm } from "@/components/auth/SignInForm";

<SignInForm />
```

### UserMenu
Client component displaying user info and sign-out option.

**Usage**:
```tsx
import { UserMenu } from "@/components/auth/UserMenu";

<UserMenu />
```

### ProtectedRoute
Wrapper component that redirects unauthenticated users to sign-in.

**Usage**:
```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

## Auth Flow

1. User visits protected route (e.g., homepage)
2. If not authenticated → redirect to /sign-in
3. User clicks "Continue with Google"
4. OAuth flow redirects to Google
5. User authorizes application
6. Redirected back to application (authenticated)
7. Session persists in Convex Auth
8. User can sign out via user menu

## Configuration

Google OAuth credentials must be set in Convex:

```bash
npx convex env set AUTH_GOOGLE_ID <client_id>
npx convex env set AUTH_GOOGLE_SECRET <client_secret>
```

## Session Management

- Sessions managed by Convex Auth
- Tokens stored securely
- Session persists across page reloads
- Auto-refresh on expiration

## User Data

User info is stored in the `users` table (from PER-9 schema):
- name
- email  
- image (avatar URL)
- emailVerified
- createdAt

The `getCurrentUser` query retrieves the authenticated user's data.
```

---

## Success Criteria

### Functional Requirements
- [ ] Google OAuth sign-in works end-to-end
- [ ] Session persists across page reloads
- [ ] Sign-out works and clears session
- [ ] User info displays correctly (name, email, avatar)
- [ ] Unauthenticated users redirected to /sign-in
- [ ] Protected routes work correctly
- [ ] No hydration errors in console

### Technical Requirements
- [ ] ConvexAuthNextjsProvider implemented correctly
- [ ] TypeScript strict mode passing
- [ ] All auth components use "use client" directive
- [ ] Server Components used for layout where possible
- [ ] Build passes with no errors
- [ ] No console errors or warnings

### UI/UX Requirements
- [ ] Sign-in page is polished and professional
- [ ] Google sign-in button has proper styling and loading state
- [ ] Header is responsive (desktop + mobile)
- [ ] User menu opens/closes correctly
- [ ] Smooth transitions and hover states
- [ ] Loading states during auth operations

---

## Timeline

| Phase | Estimated | Notes |
|-------|-----------|-------|
| Google OAuth Configuration | 15 min | Get credentials from Google Cloud Console |
| Upgrade Authentication Provider | 20 min | ConvexAuthNextjsProvider |
| Sign-In Page & Components | 30 min | Sign-in UI and form |
| Protected Routes & Auth State | 20 min | Route protection wrapper |
| Header & Navigation | 25 min | Header, user menu components |
| Testing & Validation | 15 min | End-to-end testing |
| Documentation | 10 min | Auth components README |
| **Total** | **2 hours 15 min** | Slightly over estimate |

---

## Risk Assessment

**Medium Risks**:
- Google OAuth credentials setup → Clear instructions provided, straightforward process
- Hydration errors with ConvexAuthNextjsProvider → Use proper "use client" directives
- Redirect loop issues → Proper conditional rendering with Authenticated/Unauthenticated

**Low Risks**:
- User menu dropdown positioning → Standard CSS solution
- Font loading flash → next/font handles this automatically
- Session persistence → Convex Auth handles this

**Mitigation**:
- Test auth flow thoroughly before proceeding to PER-12
- Check browser console for any hydration warnings
- Verify OAuth redirect URIs match exactly (common source of errors)
- Keep Convex dashboard open to verify environment variables

---

## Notes

- This work **depends on PER-9** (users table schema) and **PER-10** (actions for paper addition)
- Google OAuth credentials can be reused from existing Google Cloud project
- ConvexAuthNextjsProvider upgrade from PER-8's basic provider
- Auth components will be used in all subsequent phases (PER-12-15)
- Keep `npm run dev` running to test authentication flow
- Convex Auth handles user creation automatically on first sign-in

---

## Reference Links

- **Convex Auth**: https://labs.convex.dev/auth
- **Convex Auth Next.js**: https://labs.convex.dev/auth/setup/nextjs
- **Google OAuth Setup**: https://console.cloud.google.com
- **Next.js Font Optimization**: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Project Dashboard**: https://dashboard.convex.dev (project: `impartial-wolf-773`)

---

## Environment Variables Needed

Add to Convex environment (via `npx convex env set`):

```bash
AUTH_GOOGLE_ID=<your_google_client_id>
AUTH_GOOGLE_SECRET=<your_google_client_secret>
```

These are set in Convex (not in `.env.local`) for security reasons.

---

## File Structure After PER-11

```
goodpapers/
├── app/
│   ├── ConvexClientProvider.tsx (upgraded to ConvexAuthNextjsProvider)
│   ├── layout.tsx (updated with proper metadata and font)
│   ├── page.tsx (updated with ProtectedRoute and AppLayout)
│   ├── sign-in/
│   │   └── page.tsx (new sign-in page)
│   └── globals.css (existing)
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx (new)
│   │   ├── UserMenu.tsx (new)
│   │   ├── ProtectedRoute.tsx (new)
│   │   └── README.md (new)
│   └── layout/
│       ├── Header.tsx (new)
│       └── AppLayout.tsx (new)
├── convex/
│   ├── auth.ts (existing from PER-8)
│   ├── http.ts (existing from PER-8)
│   ├── schema.ts (existing from PER-9)
│   ├── users.ts (new - getCurrentUser query)
│   └── ... (other files from PER-9, PER-10)
```

---

## Testing Checklist

### Before Starting
- [ ] PER-8 complete (setup verified)
- [ ] PER-9 complete (users table exists)
- [ ] PER-10 complete (actions ready)
- [ ] Google Cloud Console access available

### During Implementation
- [ ] Google OAuth credentials created
- [ ] Environment variables set in Convex
- [ ] ConvexAuthNextjsProvider compiles without errors
- [ ] Sign-in page renders correctly
- [ ] No TypeScript errors
- [ ] Build passes

### After Implementation
- [ ] Can sign in with Google successfully
- [ ] User info displays in header
- [ ] User menu opens/closes properly
- [ ] Can sign out successfully
- [ ] Session persists across page reloads
- [ ] Unauthenticated access redirects to sign-in
- [ ] No hydration errors in console
- [ ] Responsive design works (desktop + mobile)

---

## Success Criteria Summary

**Authentication Works**:
- ✅ Google OAuth flow completes successfully
- ✅ User redirected back to app after sign-in
- ✅ Session persists across reloads
- ✅ Sign-out clears session and redirects

**UI/UX Polished**:
- ✅ Sign-in page is clean and professional
- ✅ Header looks good and is responsive
- ✅ User menu is functional and well-designed
- ✅ Loading states provide feedback
- ✅ No layout shift or flash of content

**Technical Quality**:
- ✅ No hydration errors
- ✅ TypeScript strict mode passing
- ✅ Build succeeds
- ✅ Proper use of Server/Client Components
- ✅ Good separation of concerns

---

**Ready to implement! PER-9 and PER-10 provide all backend infrastructure needed.** 🚀


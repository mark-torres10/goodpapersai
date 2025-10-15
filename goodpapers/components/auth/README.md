# Authentication Components

## Overview

Goodpapers uses Convex Auth with Google OAuth for authentication. This directory contains all authentication-related components and logic.

## Architecture

The authentication system is built on:
- **Convex Auth**: Backend authentication service with session management
- **ConvexAuthNextjsProvider**: Next.js-specific provider for SSR support
- **Google OAuth**: Single sign-on provider for user authentication

## Components

### SignInForm

Client component for Google OAuth sign-in.

**Usage**:
```tsx
import { SignInForm } from "@/components/auth/SignInForm";

<SignInForm />
```

**Features**:
- Google OAuth button with proper branding
- Loading state during authentication
- Error handling for failed sign-in attempts
- Responsive design with Tailwind CSS

**Location**: `components/auth/SignInForm.tsx`

---

### UserMenu

Client component displaying user information and sign-out option.

**Usage**:
```tsx
import { UserMenu } from "@/components/auth/UserMenu";

<UserMenu />
```

**Features**:
- User avatar from Google profile
- Dropdown menu with user info (name, email)
- Sign-out button
- Click-outside detection to close menu
- Loading states for user data
- Responsive design

**Location**: `components/auth/UserMenu.tsx`

---

### ProtectedRoute

Wrapper component that protects routes requiring authentication.

**Usage**:
```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

**Features**:
- Redirects unauthenticated users to `/sign-in`
- Shows loading spinner during auth check
- Renders children only when authenticated
- No flash of unauthenticated content

**Location**: `components/auth/ProtectedRoute.tsx`

---

## Authentication Flow

1. **User visits protected route** (e.g., homepage)
2. **ProtectedRoute checks auth state**:
   - If loading → show spinner
   - If unauthenticated → redirect to `/sign-in`
   - If authenticated → render content
3. **User clicks "Continue with Google"**
4. **OAuth flow redirects to Google**
5. **User authorizes application**
6. **Redirected back to application** (authenticated)
7. **Session persists in Convex Auth**
8. **User can sign out via UserMenu**

## Configuration

### Google OAuth Credentials

Google OAuth credentials must be set in Convex:

```bash
npx convex env set AUTH_GOOGLE_ID <client_id>
npx convex env set AUTH_GOOGLE_SECRET <client_secret>
```

**To create credentials**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select project "Goodpapers"
3. Enable Google OAuth API
4. Create OAuth 2.0 credentials (Web application)
5. Configure authorized redirect URIs:
   - Development: `https://impartial-wolf-773.convex.site/api/auth/callback/google`
6. Copy Client ID and Client Secret

### Next.js Configuration

Remote images are configured in `next.config.ts` to allow Google profile images:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.googleusercontent.com",
    },
  ],
}
```

## Session Management

- **Sessions managed by**: Convex Auth
- **Storage**: HTTP-only cookies (secure)
- **Persistence**: Sessions persist across page reloads
- **Auto-refresh**: Tokens refresh automatically on expiration
- **Sign-out**: Clears session and redirects to `/sign-in`

## User Data

User information is stored in the `users` table (see `convex/schema.ts`):

```typescript
{
  name: string | undefined;
  email: string | undefined;
  image: string | undefined;      // Avatar URL from Google
  emailVerified: number | undefined;
  createdAt: number;              // Timestamp
}
```

**Querying user data**:
```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const user = useQuery(api.users.getCurrentUser);
```

## Dynamic Rendering

All pages using authentication must force dynamic rendering to avoid build-time errors:

```typescript
// In any page using auth
export const dynamic = "force-dynamic";
```

This prevents Next.js from trying to statically generate pages that require the Convex auth context at runtime.

## Security Considerations

1. **OAuth tokens**: Never exposed to client (handled by Convex)
2. **Session cookies**: HTTP-only, secure in production
3. **HTTPS required**: OAuth redirects require HTTPS in production
4. **CORS**: Configured automatically by Convex Auth
5. **Token refresh**: Automatic, no client-side token management

## Troubleshooting

### Build errors: "Cannot destructure property 'isLoading'"
**Solution**: Ensure all auth-protected pages have `export const dynamic = "force-dynamic"`

### OAuth redirect fails
**Solution**: Verify redirect URI in Google Console matches Convex deployment URL exactly

### User avatar not loading
**Solution**: Ensure `next.config.ts` has `*.googleusercontent.com` in `remotePatterns`

### Session not persisting
**Solution**: Check browser cookies are enabled and not being blocked

### Sign-out doesn't work
**Solution**: Verify `signOut()` from `useAuthActions()` is being called correctly

## Related Files

- `convex/auth.ts` - Convex Auth configuration with Google provider
- `convex/http.ts` - HTTP routes for OAuth callbacks
- `convex/users.ts` - User queries including `getCurrentUser`
- `app/ConvexClientProvider.tsx` - Auth provider wrapping the app
- `app/sign-in/page.tsx` - Sign-in page
- `app/page.tsx` - Protected homepage example

## Next Steps

After authentication is complete:
- PER-12: Home Page (Paper List)
- PER-13: Add Paper Feature  
- PER-14: Paper Detail Page
- PER-15: PDF Viewer Integration

All subsequent features depend on this authentication foundation.


/**
 * Convex Authentication Configuration
 * 
 * Configures authentication for Goodpapers using Convex Auth with Google OAuth.
 * This setup enables "Sign in with Google" functionality.
 * 
 * @module convex/auth
 * @see https://labs.convex.dev/auth
 */

import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

/**
 * Convex Auth instance with Google OAuth provider.
 * 
 * Exports:
 * - auth: Authentication handler for HTTP routes
 * - signIn: Client-side function to initiate sign-in
 * - signOut: Client-side function to sign out
 * - store: Auth state storage
 * - isAuthenticated: Helper to check auth status
 * 
 * OAuth credentials should be set via:
 * - npx convex env set AUTH_GOOGLE_ID <client_id>
 * - npx convex env set AUTH_GOOGLE_SECRET <client_secret>
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
});


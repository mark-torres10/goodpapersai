"use client";

/**
 * Sign In Form Component
 * 
 * Provides Google OAuth sign-in button with loading state management.
 * Handles the authentication flow using Convex Auth.
 * 
 * Note: Full OAuth integration pending. Currently shows UI only.
 * Will be fully enabled when ConvexAuthNextjsProvider is configured.
 * 
 * @module components/auth/SignInForm
 */

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

/**
 * Sign In Form
 *
 * Displays a Google OAuth sign-in button with loading state.
 * Note: OAuth flow to be fully integrated in future ticket.
 *
 * @returns Sign-in form component
 */
export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Get auth actions - must be called unconditionally
  const authActions = useAuthActions();

  const handleGoogleSignIn = async () => {
    if (!authActions?.signIn) {
      console.error("Sign in not available");
      setAuthError("Authentication not available. Please refresh the page.");
      return;
    }
    
    setIsLoading(true);
    setAuthError(null);
    try {
      await authActions.signIn("google");
    } catch (error) {
      console.error("Sign in failed:", error);
      setAuthError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {authError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{authError}</p>
        </div>
      )}
      
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


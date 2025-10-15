"use client";

/**
 * Protected Route Component
 * 
 * Wrapper component that protects routes requiring authentication.
 * Redirects unauthenticated users to the sign-in page.
 * 
 * @module components/auth/ProtectedRoute
 */

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Protected Route Wrapper
 * 
 * Shows loading state while checking authentication.
 * Redirects unauthenticated users to /sign-in.
 * Renders children for authenticated users.
 * 
 * @param props - Component props
 * @param props.children - Protected content to render when authenticated
 * @returns Protected route wrapper
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

/**
 * Redirect to Sign In
 * 
 * Internal component that handles redirection to the sign-in page
 * for unauthenticated users.
 * 
 * @returns Redirect component
 */
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


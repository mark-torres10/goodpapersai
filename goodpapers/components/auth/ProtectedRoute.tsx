"use client";

/**
 * Protected Route Component
 *
 * Checks authentication and redirects to sign-in if not authenticated.
 *
 * @module components/auth/ProtectedRoute
 */

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

/**
 * Protected Route Wrapper
 *
 * Checks if user is authenticated and redirects to sign-in if not.
 *
 * @param props - Component props
 * @param props.children - Protected content to render when authenticated
 * @returns Protected route wrapper or loading state
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      // User is not authenticated, redirect to sign-in
      router.push("/sign-in");
    }
  }, [user, router]);

  // Show loading while checking authentication
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render anything (redirect will happen)
  if (user === null) {
    return null;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}


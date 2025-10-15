"use client";

/**
 * Protected Route Component
 *
 * Note: Auth functionality temporarily disabled for testing.
 * In production, this would check authentication and redirect if needed.
 *
 * @module components/auth/ProtectedRoute
 */

/**
 * Protected Route Wrapper
 *
 * Note: Auth functionality temporarily disabled for testing.
 * In production, this would check authentication and redirect if needed.
 *
 * @param props - Component props
 * @param props.children - Protected content to render when authenticated
 * @returns Protected route wrapper (currently just renders children)
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // TODO: Implement proper authentication checking
  // For now, just render children (mock authenticated state)
  return <>{children}</>;
}


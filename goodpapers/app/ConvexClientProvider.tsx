"use client";

/**
 * Convex Client Provider Component
 *
 * Note: Convex functionality temporarily disabled for testing.
 * In production, this would provide Convex backend connectivity.
 *
 * @module app/ConvexClientProvider
 */

import { ReactNode } from "react";

/**
 * Convex Provider
 *
 * Note: Convex functionality temporarily disabled for testing.
 * In production, this would wrap the application with Convex context.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with Convex context
 * @returns Convex provider wrapping children
 */
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  // TODO: Re-enable Convex provider when auth is working
  return <>{children}</>;
}


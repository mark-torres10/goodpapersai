"use client";

/**
 * Convex Client Provider Component
 *
 * Provides Convex backend connectivity to the application.
 *
 * @module app/ConvexClientProvider
 */

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Convex Provider
 *
 * Wraps the application with Convex context for database connectivity.
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
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}


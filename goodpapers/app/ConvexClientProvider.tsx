"use client";

/**
 * Convex Client Provider Component
 *
 * Provides Convex backend connectivity and authentication to the application.
 *
 * @module app/ConvexClientProvider
 */

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Convex Provider with Authentication
 *
 * Wraps the application with Convex context for database connectivity
 * and authentication support.
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
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
}


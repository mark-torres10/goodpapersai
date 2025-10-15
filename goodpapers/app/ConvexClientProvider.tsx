"use client";

/**
 * Convex Client Provider Component
 *
 * Provides Convex backend connectivity and authentication to the entire Next.js application.
 * This component wraps the app in ConvexAuthNextjsProvider, enabling all child components
 * to use Convex queries, mutations, actions, and authentication features.
 *
 * @module app/ConvexClientProvider
 * @see https://labs.convex.dev/auth/setup/nextjs
 */

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Convex Authentication Provider
 *
 * Wraps the application with Convex Auth context, providing access to backend
 * queries, mutations, actions, and authentication throughout the component tree.
 *
 * Uses ConvexAuthNextjsProvider for proper SSR support and to prevent hydration errors.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with Convex context
 * @returns Convex auth provider wrapping children
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


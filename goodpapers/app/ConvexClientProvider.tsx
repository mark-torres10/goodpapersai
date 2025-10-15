"use client";

/**
 * Convex Client Provider Component
 *
 * Provides Convex backend connectivity and authentication to the entire Next.js application.
 * This component wraps the app in ConvexProvider, enabling all child components
 * to use Convex queries, mutations, actions, and authentication features.
 *
 * @module app/ConvexClientProvider
 * @see https://docs.convex.dev/client/react
 */

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Convex Provider
 *
 * Wraps the application with Convex context, providing access to backend
 * queries, mutations, actions, and authentication throughout the component tree.
 *
 * Uses ConvexProvider for standard Convex integration with authentication handled by Convex Auth.
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
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}


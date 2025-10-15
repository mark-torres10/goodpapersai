"use client";

/**
 * Convex Client Provider Component
 * 
 * Provides Convex backend connectivity to the entire Next.js application.
 * This component wraps the app in a ConvexProvider, enabling all child
 * components to use Convex queries, mutations, and actions.
 * 
 * @module app/ConvexClientProvider
 * @see https://docs.convex.dev/quickstart/nextjs
 */

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Initialize Convex client with deployment URL from environment
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL environment variable is required. " +
    "Run 'npx convex dev' to configure Convex and generate .env.local"
  );
}

const convex = new ConvexReactClient(convexUrl);

/**
 * Convex Client Provider
 * 
 * Wraps the application with Convex context, providing access to backend
 * queries, mutations, and actions throughout the component tree.
 * 
 * @param props - Component props
 * @param props.children - Child components to wrap with Convex context
 * @returns Convex provider wrapping children
 * 
 * @note This uses basic ConvexProvider for PER-8 setup.
 * @note Will be upgraded to ConvexAuthNextjsProvider in PER-11 for full authentication.
 */
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}


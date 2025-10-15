/**
 * App Layout Component
 * 
 * Main layout wrapper for authenticated pages.
 * Includes the header and main content area with consistent styling.
 * 
 * @module components/layout/AppLayout
 */

import { Header } from "./Header";
import { ReactNode } from "react";

/**
 * App Layout
 * 
 * Wraps authenticated pages with a consistent layout structure.
 * Includes header navigation and main content area.
 * 
 * @param props - Component props
 * @param props.children - Page content to render in the layout
 * @returns App layout wrapper
 */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}


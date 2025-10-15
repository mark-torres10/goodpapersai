"use client";

/**
 * Header Component
 * 
 * Main navigation header displayed on authenticated pages.
 * Shows the Goodpapers logo and user menu.
 * 
 * @module components/layout/Header
 */

import { Authenticated } from "convex/react";
import { UserMenu } from "@/components/auth/UserMenu";
import Link from "next/link";

/**
 * Header Component
 * 
 * Displays the application header with logo and user menu.
 * Responsive design with max-width container.
 * 
 * @returns Header component
 */
export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <span>📚</span>
          <span>Goodpapers</span>
        </Link>

        {/* User Menu */}
        <Authenticated>
          <UserMenu />
        </Authenticated>
      </div>
    </header>
  );
}


/**
 * Not Found Page
 * 
 * Custom 404 page for Goodpapers.
 * Does not use auth context to avoid build-time errors.
 * 
 * @module app/not-found
 */

import Link from "next/link";
import type { Metadata } from "next";

// Force dynamic rendering to avoid build-time auth context issues
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Page Not Found - Goodpapers",
  description: "The page you're looking for doesn't exist.",
};

/**
 * Not Found Page Component
 * 
 * Displays a friendly 404 error message.
 * 
 * @returns 404 page
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <p className="mt-2 text-sm text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}


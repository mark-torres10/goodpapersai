"use client";

/**
 * Error Boundary
 * 
 * Global error boundary for the application.
 * Catches runtime errors and displays a fallback UI.
 * 
 * @module app/error
 */

import { useEffect } from "react";
import Link from "next/link";

/**
 * Application Error Boundary Component
 *
 * Displays error UI when something goes wrong.
 * Provides a reset button to try recovering.
 * Note: Renamed from "Error" to avoid shadowing the global Error constructor.
 *
 * @param props - Error boundary props
 * @param props.error - The error that was thrown
 * @param props.reset - Function to reset the error boundary
 * @returns Error UI
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  // Sanitize error message for production
  const displayErrorMessage = process.env.NODE_ENV === "development" ? error.message : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-10 shadow-xl text-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            We encountered an unexpected error. Please try again.
          </p>
          {displayErrorMessage && (
            <p className="mt-4 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
              {displayErrorMessage}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}


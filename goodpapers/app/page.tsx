/**
 * Home Page
 * 
 * Main landing page for authenticated users.
 * Displays the user's paper library (placeholder for PER-12).
 * 
 * @module app/page
 */

import { AppLayout } from "@/components/layout/AppLayout";

/**
 * Home Page Component
 *
 * Displays the user's paper library.
 * Note: Auth functionality temporarily disabled for testing.
 *
 * @returns Home page
 */
export default function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Papers
        </h1>

        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600">
            Your paper library will appear here.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            PER-12: Home Page coming next!
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

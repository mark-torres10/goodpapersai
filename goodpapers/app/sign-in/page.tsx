/**
 * Sign In Page
 * 
 * Public authentication page for users to sign in with Google OAuth.
 * Displays the Goodpapers branding and sign-in form.
 * 
 * @module app/sign-in/page
 */

import { SignInForm } from "@/components/auth/SignInForm";

/**
 * Sign In Page Component
 * 
 * Renders the sign-in page with Google OAuth authentication.
 * Features a centered card with gradient background.
 * 
 * @returns Sign-in page
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Goodpapers
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your academic paper reading tracker
          </p>
        </div>
        
        <SignInForm />
      </div>
    </div>
  );
}


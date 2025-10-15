"use client";

/**
 * User Menu Component
 * 
 * Dropdown menu displaying user information and sign-out option.
 * Includes user avatar, name, and email.
 * 
 * @module components/auth/UserMenu
 */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/**
 * User Menu
 *
 * Displays a dropdown menu with user info and sign-out button.
 * Note: Auth functionality temporarily disabled for testing.
 *
 * @returns User menu component
 */
export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mock user data for testing
  const user = {
    name: "Test User",
    email: "test@example.com",
    image: "https://lh3.googleusercontent.com/a/default-user"
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) {
      return; // Don't add listener if menu is closed
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    // TODO: Implement sign-out functionality
    console.log("Sign-out would be implemented here");
  };

  // User data is available (mock data for testing)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
            priority={true}
            sizes="32px"
          />
        )}
        <span>{user.name || "User"}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}


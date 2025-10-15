/**
 * Root Layout Component
 * 
 * The root layout for the Goodpapers application. This layout wraps all pages
 * and provides global configuration including fonts, metadata, and Convex backend
 * connectivity.
 * 
 * @module app/layout
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure Inter font from Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Application metadata for SEO and browser display
 */
export const metadata: Metadata = {
  title: "Goodpapers - Academic Paper Reading Tracker",
  description: "Track, organize, and annotate your academic paper reading like Goodreads for research papers.",
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Root Layout Component
 *
 * Provides the HTML structure and global providers for the entire application.
 * Includes Inter font and Tailwind CSS styling.
 * Note: Convex backend provider temporarily disabled for testing.
 *
 * @param props - Layout props
 * @param props.children - Page content to render within the layout
 * @returns The root HTML structure with all providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

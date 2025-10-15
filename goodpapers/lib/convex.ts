// Convex utility functions

/**
 * Validate if a string is a valid Convex ID format
 * Convex IDs are base32-encoded strings of specific length
 */
export function isValidConvexId(id: string): boolean {
  // Convex IDs are typically 32 characters, alphanumeric lowercase
  // Format: lowercase letters and numbers, no special characters
  return /^[a-z0-9]{32}$/.test(id);
}

/**
 * Get PDF URL from storage ID
 * Uses environment variable for Convex site URL
 */
export function getPdfUrl(storageId: string): string {
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  
  if (!convexSiteUrl) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_SITE_URL environment variable is not set. " +
      "Please add it to your .env.local file."
    );
  }

  // Remove trailing slash if present
  const baseUrl = convexSiteUrl.replace(/\/$/, '');
  
  return `${baseUrl}/pdf/${storageId}`;
}


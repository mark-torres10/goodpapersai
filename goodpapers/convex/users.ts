/**
 * User Queries and Mutations
 * 
 * Functions for managing user data and authentication state.
 * 
 * @module convex/users
 */

import { query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Get the currently authenticated user
 * 
 * Returns the user object for the currently authenticated user.
 * Note: Currently returns a mock user for testing until full OAuth is configured.
 * 
 * @returns User object with name, email, image
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Full OAuth integration - use auth.getUserId() when ConvexAuthNextjsProvider is configured
    // For now, look for or return first test user for testing
    
    // Try to get existing test user
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "test@goodpapers.dev"))
      .first();
    
    if (existingUser) {
      return existingUser;
    }
    
    // Return any first user if exists (for testing)
    const anyUser = await ctx.db.query("users").first();
    if (anyUser) {
      return anyUser;
    }
    
    // Return null if no users exist (user needs to be created via Convex dashboard)
    return null;
  },
});


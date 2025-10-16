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
 * 
 * DEVELOPMENT MODE: Returns mock test user for testing without OAuth.
 * PRODUCTION MODE: Uses real authentication via auth.getUserId().
 * 
 * @returns User object with name, email, image, or null
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Use real authentication - no more mock auth
    const userId = await auth.getUserId(ctx);
    
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    return user;
  },
});


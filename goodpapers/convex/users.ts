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
 * Returns the user object for the currently authenticated user,
 * or null if no user is authenticated.
 * 
 * @returns User object with name, email, image, or null
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get user ID from auth session
    const userId = await auth.getUserId(ctx);
    
    if (!userId) {
      return null;
    }

    // Get user from database
    const user = await ctx.db.get(userId);
    return user;
  },
});


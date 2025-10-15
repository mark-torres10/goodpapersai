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
    // Check if mock authentication is enabled (set via environment variable)
    // SECURITY: This should ONLY be enabled in development
    // Production deployments should NOT have ENABLE_MOCK_AUTH set
    const enableMockAuth = process.env.ENABLE_MOCK_AUTH === "true";
    
    // PRODUCTION: Use real authentication
    if (!enableMockAuth) {
      const userId = await auth.getUserId(ctx);
      
      if (!userId) {
        return null;
      }

      const user = await ctx.db.get(userId);
      return user;
    }
    
    // DEVELOPMENT/TEST: Use mock test user
    // Only returns the specific test user by email - never returns arbitrary users
    const testUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "test@goodpapers.dev"))
      .first();
    
    if (testUser) {
      return testUser;
    }
    
    // If test user doesn't exist, return null
    // User must be created via setup:createTestUser mutation
    console.warn("Test user not found. Run: npx convex run setup:createTestUser");
    return null;
  },
});


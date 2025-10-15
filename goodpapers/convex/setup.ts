/**
 * Setup utilities for Convex database
 * 
 * Mutations for initializing test data and configuration.
 * 
 * @module convex/setup
 */

import { mutation } from "./_generated/server";

/**
 * Create a test user for development/testing
 * 
 * Creates a mock user in the database that can be used for testing
 * the application without full OAuth integration.
 */
export const createTestUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if test user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "test@goodpapers.dev"))
      .first();
    
    if (existing) {
      console.log("Test user already exists:", existing._id);
      return existing._id;
    }
    
    // Create test user
    const userId = await ctx.db.insert("users", {
      name: "Test User",
      email: "test@goodpapers.dev",
      image: "https://lh3.googleusercontent.com/a/default-user",
      createdAt: Date.now(),
    });
    
    console.log("Created test user:", userId);
    return userId;
  },
});


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
 * 
 * SECURITY: This mutation is ONLY callable in development/test environments.
 * Production calls will be rejected to prevent unauthorized user creation.
 */
export const createTestUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if mock authentication is enabled (set via environment variable)
    // SECURITY: This should ONLY be enabled in development
    // Production deployments should NOT have ENABLE_MOCK_AUTH set
    const enableMockAuth = process.env.ENABLE_MOCK_AUTH === "true";
    
    // SECURITY: Only allow in development/test environments
    if (!enableMockAuth) {
      throw new Error(
        "createTestUser is not available in production. " +
        "ENABLE_MOCK_AUTH must be set to 'true' in development environment. " +
        "Use proper OAuth authentication in production."
      );
    }
    
    // Check if test user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), "test@goodpapers.dev"))
      .first();
    
    if (existing) {
      console.log("Test user already exists:", existing._id);
      return existing._id;
    }
    
    // Create test user with stable placeholder image service
    const userId = await ctx.db.insert("users", {
      name: "Test User",
      email: "test@goodpapers.dev",
      image: "https://ui-avatars.com/api/?name=Test+User&background=4F46E5&color=fff",
      createdAt: Date.now(),
    });
    
    console.log("Created test user:", userId);
    return userId;
  },
});


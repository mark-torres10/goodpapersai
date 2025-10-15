/**
 * Convex HTTP Router Configuration
 * 
 * Configures HTTP routes for the Goodpapers backend, including
 * authentication endpoints for Google OAuth.
 * 
 * @module convex/http
 * @see https://docs.convex.dev/functions/http-actions
 */

import { httpRouter } from "convex/server";
import { auth } from "./auth";

/**
 * HTTP router instance for handling HTTP requests to Convex.
 * 
 * Currently configured routes:
 * - /api/auth/* - Authentication routes (Google OAuth callback, sign-in, sign-out)
 * 
 * Additional routes will be added in future phases:
 * - /pdf/:storageId - Serve PDFs from Convex Storage (PER-10)
 */
const http = httpRouter();

// Add authentication routes
auth.addHttpRoutes(http);

export default http;


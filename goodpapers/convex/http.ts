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
import { httpAction } from "./_generated/server";
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

// Serve PDF from Convex Storage
http.route({
  path: "/pdf/:storageId",
  method: "GET",
  handler: httpAction(async (ctx: any, request: any) => {
    // Extract storage ID from URL
    const urlParts = request.url.split("/pdf/");
    const storageId = urlParts[1];

    if (!storageId) {
      return new Response("Storage ID required", { status: 400 });
    }

    try {
      // Get file from storage
      const blob = await ctx.storage.get(storageId as any);

      if (!blob) {
        return new Response("PDF not found", { status: 404 });
      }

      // Return PDF with proper headers
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": blob.contentType || "application/pdf",
          "Content-Length": blob.size?.toString(),
          "Cache-Control": "public, max-age=31536000", // Cache for 1 year
          "Access-Control-Allow-Origin": "*", // Allow CORS for PDF viewer
        },
      });
    } catch (error) {
      console.error("Error serving PDF:", error);
      return new Response("Internal server error", { status: 500 });
    }
  })
});

export default http;


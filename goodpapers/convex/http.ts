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

// Handle CORS preflight for PDF requests
http.route({
  path: "/pdf/:storageId",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }),
});

// Serve PDF from Convex Storage
http.route({
  path: "/pdf/:storageId",
  method: "GET",
  handler: httpAction(async (ctx: any, request: any) => {
    // Extract storage ID from URL
    const urlParts = request.url.split("/pdf/");
    const storageId = urlParts[1];

    if (!storageId) {
      return new Response("Storage ID required", { 
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    try {
      // Get file from storage
      const blob = await ctx.storage.get(storageId as any);

      if (!blob) {
        return new Response("PDF not found", { 
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Return PDF with proper headers including CORS
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Cache-Control": "public, max-age=31536000", // Cache for 1 year
          "Access-Control-Allow-Origin": "*", // Allow CORS for PDF viewer
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      });
    } catch (error) {
      console.error("Error serving PDF:", error);
      return new Response("Internal server error", { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  })
});

export default http;


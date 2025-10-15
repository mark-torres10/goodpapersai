import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

// Existing auth routes
auth.addHttpRoutes(http);

// Serve PDF from Convex Storage
http.route({
  path: "/pdf/:storageId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    // Extract storage ID from URL
    const storageId = request.url.split("/pdf/")[1];

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
          "Content-Type": "application/pdf",
          "Cache-Control": "public, max-age=31536000", // Cache for 1 year
          "Access-Control-Allow-Origin": "*", // Allow CORS for PDF viewer
        },
      });
    } catch (error) {
      console.error("Error serving PDF:", error);
      return new Response("Internal server error", { status: 500 });
    }
  }),
});

export default http;
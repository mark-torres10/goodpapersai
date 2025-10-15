/**
 * ArXiv Actions for Convex
 *
 * This module provides Convex actions for downloading and storing ArXiv papers.
 * Actions run with full Node.js environment access for external API calls.
 *
 * @module convex/arxiv/actions
 */

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { fetchArxivMetadata } from "./api";
import { parseArxivId, getArxivUrls, isValidArxivId } from "./parser";

/**
 * Add paper from ArXiv URL or ID
 * Returns metadata and storage ID for PDF
 */
export const addPaperFromArxiv = action({
  args: {
    input: v.string(), // URL or ArXiv ID
    userId: v.id("users"),
  },
  handler: async (ctx: any, args: { input: string; userId: string }): Promise<any> => {
    // Step 1: Parse ArXiv ID
    const arxivId = parseArxivId(args.input);
    if (!arxivId) {
      throw new Error("Invalid ArXiv URL or ID format");
    }

    if (!isValidArxivId(arxivId)) {
      throw new Error(`Invalid ArXiv ID: ${arxivId}`);
    }

    console.log(`Fetching metadata for ${arxivId}...`);

    // Step 2: Check for duplicate (if PER-9 schema exists)
    let existing: any = null;
    try {
      existing = await ctx.runQuery(api.papers.getPaperByArxivId, {
        arxivId,
        userId: args.userId,
      });
      if (existing) {
        return {
          error: "Paper already exists",
          paperId: existing._id,
        };
      }
    } catch (error) {
      // If papers.getPaperByArxivId doesn't exist (PER-9 not done),
      // continue anyway - we'll just return the data
      console.log("Note: Could not check for duplicates (PER-9 not complete)");
    }

    // Step 3: Fetch metadata from ArXiv
    const metadata = await fetchArxivMetadata(arxivId);

    console.log(`Downloading PDF (${metadata.title})...`);

    // Step 4: Download PDF
    const pdfUrl = metadata.pdfUrl;
    const pdfResponse = await fetch(pdfUrl);

    if (!pdfResponse.ok) {
      throw new Error(`Failed to download PDF: ${pdfResponse.status}`);
    }

    // Step 5: Store PDF in Convex Storage
    const pdfBlob = await pdfResponse.blob();
    const pdfStorageId = await ctx.storage.store(pdfBlob);

    console.log(`Storing PDF in Convex Storage...`);

    // Step 6: Create paper in database (if PER-9 exists)
    let paperId;
    try {
      paperId = await ctx.runMutation(api.papers.createPaper, {
        userId: args.userId,
        title: metadata.title,
        authors: metadata.authors,
        abstract: metadata.abstract,
        arxivId: metadata.arxivId,
        arxivUrl: metadata.arxivUrl,
        pdfUrl: metadata.pdfUrl,
        publishedDate: metadata.publishedDate,
        pdfStorageId,
      });
    } catch (error) {
      // If createPaper doesn't exist, return metadata anyway
      console.log("Note: Could not create paper (PER-9 not complete)");
      return {
        ...metadata,
        pdfStorageId,
        message: "Metadata and PDF downloaded, but database not ready",
      };
    }

    console.log(`Paper added successfully!`);

    return {
      paperId,
      ...metadata,
      pdfStorageId,
    };
  },
});
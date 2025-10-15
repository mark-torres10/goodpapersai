/**
 * ArXiv API Integration
 *
 * Fetches paper metadata from ArXiv API and parses XML responses.
 * Handles rate limiting and error cases gracefully.
 *
 * @module convex/arxiv/api
 */

import { XMLParser } from "fast-xml-parser";

export interface ArxivPaperMetadata {
  title: string;
  authors: string[];
  abstract: string;
  arxivId: string;
  publishedDate: string; // ISO format
  updatedDate: string; // ISO format
  arxivUrl: string;
  pdfUrl: string;
  categories: string[];
}

/**
 * Fetch paper metadata from ArXiv API
 */
export async function fetchArxivMetadata(
  arxivId: string
): Promise<ArxivPaperMetadata> {
  // Validate ID
  if (!/^\d{4}\.\d{4,5}$/.test(arxivId)) {
    throw new Error(`Invalid ArXiv ID format: ${arxivId}`);
  }

  // Build API URL
  const apiUrl = `http://export.arxiv.org/api/query?id_list=${arxivId}`;

  // Fetch from ArXiv with retry logic
  const response = await fetchWithRetry(apiUrl);

  const xmlText = await response.text();

  // Parse XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(xmlText);

  // Extract entry (ArXiv returns Atom feed format)
  const entry = parsed.feed?.entry;
  if (!entry) {
    throw new Error(`Paper not found: ${arxivId}`);
  }

  // Parse authors (can be single object or array)
  let authors: string[] = [];
  if (entry.author) {
    if (Array.isArray(entry.author)) {
      authors = entry.author.map((a: any) => a.name);
    } else {
      authors = [entry.author.name];
    }
  }

  // Parse categories
  let categories: string[] = [];
  if (entry.category) {
    if (Array.isArray(entry.category)) {
      categories = entry.category.map((c: any) => c["@_term"]);
    } else {
      categories = [entry.category["@_term"]];
    }
  }

  // Extract title (trim whitespace and newlines)
  const title = entry.title?.replace(/\s+/g, " ").trim() || "Untitled";

  // Extract abstract (trim whitespace)
  const abstract = entry.summary?.replace(/\s+/g, " ").trim() || "";

  // Parse dates
  const publishedDate = entry.published || new Date().toISOString();
  const updatedDate = entry.updated || publishedDate;

  // Get URLs
  const arxivUrl = `https://arxiv.org/abs/${arxivId}`;
  const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;

  return {
    title,
    authors,
    abstract,
    arxivId,
    publishedDate,
    updatedDate,
    arxivUrl,
    pdfUrl,
    categories,
  };
}

/**
 * Fetch with retry logic (for rate limiting)
 */
async function fetchWithRetry(
  url: string,
  maxRetries = 3,
  delayMs = 3000
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }

      // If 429 (rate limit), wait and retry
      if (response.status === 429 && i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Max retries exceeded");
}
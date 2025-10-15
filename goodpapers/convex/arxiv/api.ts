/**
 * ArXiv API Integration
 *
 * This module handles fetching paper metadata from the ArXiv API.
 * Uses fast-xml-parser to parse XML responses into structured data.
 *
 * @module convex/arxiv/api
 */

import { XMLParser } from "fast-xml-parser";
import { isValidArxivId, getArxivUrls } from "./parser";

// XML structure types for better type safety
interface ArxivAuthor {
  name: string;
}

interface ArxivCategory {
  "@_term": string;
}

interface ArxivEntry {
  title: string;
  author: ArxivAuthor | ArxivAuthor[];
  category?: ArxivCategory | ArxivCategory[];
  summary?: string;
  published?: string;
  updated?: string;
}

interface ArxivFeed {
  feed?: { entry?: ArxivEntry };
}

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
  if (!isValidArxivId(arxivId)) {
    throw new Error(`Invalid ArXiv ID format: ${arxivId}`);
  }

  // Build API URL
  const apiUrl = `https://export.arxiv.org/api/query?id_list=${arxivId}`;

  // Fetch from ArXiv with retry logic
  const response = await fetchWithRetry(apiUrl, 3, 3000, {
    headers: {
      "User-Agent": "GoodpapersAI/1.0 (+https://github.com/mark-torres10/goodpapersai; contact@example.com)",
      "Accept": "application/atom+xml",
    },
  });

  const xmlText = await response.text();

  // Parse XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(xmlText) as ArxivFeed;

  // Extract entry (ArXiv returns Atom feed format)
  const entry = parsed.feed?.entry as ArxivEntry | undefined;
  if (!entry) {
    throw new Error(`Paper not found: ${arxivId}`);
  }

  // Check if entry has actual content (ArXiv returns empty entry for non-existent papers)
  if (!entry.title || entry.title.trim() === "") {
    throw new Error(`Paper not found: ${arxivId}`);
  }

  // Parse authors (can be single object or array)
  let authors: string[] = [];
  if (entry.author) {
    if (Array.isArray(entry.author)) {
      authors = entry.author.map((a) => a.name);
    } else {
      authors = [entry.author.name];
    }
  }

  // Parse categories
  let categories: string[] = [];
  if (entry.category) {
    if (Array.isArray(entry.category)) {
      categories = entry.category.map((c) => c["@_term"]);
    } else {
      categories = [entry.category["@_term"]];
    }
  }

  // Extract title (trim whitespace and newlines)
  const title = entry.title.replace(/\s+/g, " ").trim();

  // Extract abstract (trim whitespace)
  const abstract = entry.summary?.replace(/\s+/g, " ").trim() || "";

  // Parse dates
  if (!entry.published) {
    throw new Error(`Missing published date for paper: ${arxivId}`);
  }
  const publishedDate = entry.published;
  const updatedDate = entry.updated || entry.published;

  // Get URLs
  const { abs: arxivUrl, pdf: pdfUrl } = getArxivUrls(arxivId);

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
  baseDelayMs = 3000,
  init: RequestInit = {},
  timeoutMs = 15000
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(url, { ...init, signal: controller.signal });

      if (response.ok) {
        return response;
      }

      // If 429 (rate limit), check Retry-After header and wait
      if (response.status === 429 && i < maxRetries - 1) {
        const retryAfter = response.headers.get("Retry-After");
        let delayMs = baseDelayMs * Math.pow(2, i);
        if (retryAfter) {
          const secs = Number(retryAfter);
          if (Number.isFinite(secs)) {
            delayMs = secs * 1000;
          } else {
            const dateMs = Date.parse(retryAfter);
            if (!Number.isNaN(dateMs)) {
              delayMs = Math.max(0, dateMs - Date.now());
            }
          }
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      // Don't retry client errors (4xx except 429) or server errors that won't recover
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Exponential backoff for other errors
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, i)));
        continue;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      // Don't retry TypeError (invalid URL, network configuration issues)
      if (error instanceof TypeError && i === 0) {
        throw error;
      }
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * Math.pow(2, i)));
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  throw new Error("Max retries exceeded");
}
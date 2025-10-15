/**
 * ArXiv URL Parser and ID Validation
 *
 * This module provides utilities for parsing ArXiv URLs and extracting ArXiv IDs.
 * Supports multiple URL formats and validates ID patterns.
 *
 * @module convex/arxiv/parser
 */

/**
 * Extract ArXiv ID from various URL formats
 *
 * Supported formats:
 * - https://arxiv.org/abs/2301.12345
 * - https://arxiv.org/pdf/2301.12345.pdf
 * - http://arxiv.org/abs/2301.12345v1
 * - arxiv.org/abs/2301.12345
 * - 2301.12345 (direct ID)
 */
export function parseArxivId(input: string): string | null {
  // Remove whitespace
  const trimmed = input.trim();

  // Direct ArXiv ID pattern (YYMM.NNNNN or YYMM.NNNNNvN)
  const directIdPattern = /^\d{4}\.\d{4,5}(v\d+)?$/;
  if (directIdPattern.test(trimmed)) {
    return trimmed.replace(/v\d+$/, ''); // Remove version suffix
  }

  // URL patterns
  const urlPattern = /arxiv\.org\/(abs|pdf)\/(\d{4}\.\d{4,5})(v\d+)?(\.pdf)?/;
  const match = trimmed.match(urlPattern);

  if (match) {
    return match[2]; // Return just the ID (YYMM.NNNNN)
  }

  return null;
}

/**
 * Generate ArXiv URLs from ID
 */
export function getArxivUrls(arxivId: string) {
  return {
    abs: `https://arxiv.org/abs/${arxivId}`,
    pdf: `https://arxiv.org/pdf/${arxivId}.pdf`,
  };
}

/**
 * Validate ArXiv ID format
 */
export function isValidArxivId(arxivId: string): boolean {
  const pattern = /^\d{4}\.\d{4,5}$/;
  return pattern.test(arxivId);
}
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface ArxivPaper {
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  doi?: string;
  url: string;
  arxivLink?: string;
  journal?: string;
  isDuplicate?: boolean;
  existingPaper?: any;
  message?: string;
}

/**
 * Extracts ArXiv ID from a URL or direct ID input
 */
export const extractArxivId = (input: string): string | null => {
  // If it's already a simple ID (like "1234.5678" or "1234.5678v1")
  if (/^\d+\.\d+(v\d+)?$/.test(input)) {
    return input.split('v')[0]; // Remove version suffix if present
  }

  // Extract from common ArXiv URL patterns
  const urlPatterns = [
    /arxiv\.org\/abs\/(\d+\.\d+)/i,
    /arxiv\.org\/pdf\/(\d+\.\d+)/i,
    /ar5iv\.org\/abs\/(\d+\.\d+)/i,
    /ar5iv\.org\/html\/(\d+\.\d+)/i
  ];

  for (const pattern of urlPatterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Fetches paper details from ArXiv API
 */
export const fetchArxivPaper = async (arxivId: string): Promise<ArxivPaper> => {
  try {
    // Use server endpoint instead of directly calling ArXiv
    const response = await axios.post(`/api/papers/fetch-arxiv`, { arxivId });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching paper from ArXiv:', error);
    throw new Error(`Failed to fetch paper: ${error.message}`);
  }
}; 
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface ArxivPaper {
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  doi?: string;
  url: string;
  journal?: string;
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
    const response = await axios.get(`http://export.arxiv.org/api/query?id_list=${arxivId}`);
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const result = parser.parse(response.data);
    
    if (!result.feed.entry) {
      throw new Error('No paper found with that ID');
    }
    
    const entry = result.feed.entry;
    
    // Extract authors (could be single author or array)
    let authorsList = [];
    if (Array.isArray(entry.author)) {
      authorsList = entry.author.map((author: any) => author.name);
    } else if (entry.author && entry.author.name) {
      authorsList = [entry.author.name];
    }
    
    // Extract year from published date
    const publishedDate = new Date(entry.published);
    const year = publishedDate.getFullYear();
    
    // Extract DOI if available
    let doi = undefined;
    if (entry.doi) {
      doi = entry.doi;
    }
    
    return {
      title: entry.title.trim(),
      authors: authorsList,
      abstract: entry.summary.trim(),
      year,
      doi,
      url: `https://arxiv.org/abs/${arxivId}`,
      journal: 'arXiv preprint'
    };
  } catch (error: any) {
    console.error('Error fetching paper from ArXiv:', error);
    throw new Error(`Failed to fetch paper: ${error.message}`);
  }
}; 
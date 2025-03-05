import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

interface ArxivAuthor {
  name: string;
}

export interface ArxivPaper {
  title: string;
  authors: string;
  abstract: string;
  year: number;
  doi?: string;
  url: string;
  journal?: string;
}

// Extract the arxiv ID from a URL or ID string
export const extractArxivId = (input: string): string | null => {
  // Match patterns like:
  // - https://arxiv.org/abs/1706.03762
  // - https://arxiv.org/pdf/1706.03762.pdf
  // - arxiv.org/abs/1706.03762
  // - 1706.03762
  
  const urlRegex = /arxiv\.org\/(?:abs|pdf)\/([0-9.]+)(?:\.pdf)?/i;
  const urlMatch = input.match(urlRegex);
  
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  
  // Check if it's just an ID
  const idRegex = /^(?:\s*)([0-9]{4}\.[0-9]{4,5}(?:v[0-9]+)?)(?:\s*)$/;
  const idMatch = input.match(idRegex);
  
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  
  return null;
};

// Fetch paper details from ArXiv API
export const fetchArxivPaper = async (arxivId: string): Promise<ArxivPaper> => {
  try {
    const response = await axios.get(
      `http://export.arxiv.org/api/query?id_list=${arxivId}`
    );
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const result = parser.parse(response.data);
    
    if (!result.feed.entry) {
      throw new Error('No paper found for the given ArXiv ID');
    }
    
    const entry = result.feed.entry;
    
    // Extract authors
    let authorsList: string[] = [];
    if (Array.isArray(entry.author)) {
      authorsList = entry.author.map((author: ArxivAuthor) => author.name);
    } else if (entry.author) {
      authorsList = [entry.author.name];
    }
    
    // Extract year from published date (format: YYYY-MM-DD)
    const publishedYear = new Date(entry.published).getFullYear();
    
    // Extract journal reference if available
    const journal = entry['arxiv:journal_ref'] ? entry['arxiv:journal_ref']['#text'] : undefined;
    const doi = entry['arxiv:doi'] ? entry['arxiv:doi']['#text'] : undefined;
    
    const paper: ArxivPaper = {
      title: entry.title.replace(/\n/g, ' ').trim(),
      authors: authorsList.join(', '),
      abstract: entry.summary.replace(/\n/g, ' ').trim(),
      year: publishedYear,
      url: entry.id,
      doi,
      journal
    };
    
    return paper;
  } catch (error) {
    console.error('Error fetching ArXiv paper:', error);
    throw new Error('Failed to fetch paper from ArXiv');
  }
}; 
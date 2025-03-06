import { Paper, Update } from '../types';

// Use relative URL in production, localhost in development
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

// Helper function to format paper data from API
const formatPaper = (paper: any): Paper => ({
  id: paper.id,
  title: paper.title,
  authors: paper.authors,
  journal: paper.journal || '',
  year: paper.year,
  doi: paper.doi || '',
  url: paper.url || '',
  abstract: paper.abstract || '',
  isCurrentlyReading: paper.isCurrentlyReading
});

// Helper function to format update data from API
const formatUpdate = (update: any): Update => ({
  id: update.id,
  paperTitle: update.paperTitle,
  message: update.message,
  timestamp: new Date(update.timestamp)
});

// Helper function to create paper slug
export const createPaperSlug = (title: string, year: number) => {
  return `${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}-${year}`;
};

// Get all papers
export const getAllPapers = async (): Promise<Paper[]> => {
  try {
    const response = await fetch(`${API_URL}/papers`);
    if (!response.ok) {
      throw new Error('Failed to fetch papers');
    }
    
    const papers = await response.json();
    return papers.map(formatPaper);
  } catch (error) {
    console.error('Error fetching papers:', error);
    return [];
  }
};

// Get paper by ID
export const getPaperById = async (id: string): Promise<Paper | null> => {
  try {
    const response = await fetch(`${API_URL}/papers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch paper');
    }
    
    const paper = await response.json();
    return formatPaper(paper);
  } catch (error) {
    console.error(`Error fetching paper with id ${id}:`, error);
    return null;
  }
};

// Get paper by slug
export const getPaperBySlug = async (slug: string): Promise<Paper | null> => {
  try {
    const response = await fetch(`${API_URL}/papers/slug/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch paper by slug');
    }
    
    const paper = await response.json();
    return formatPaper(paper);
  } catch (error) {
    console.error(`Error fetching paper with slug ${slug}:`, error);
    return null;
  }
};

// Get all updates
export const getAllUpdates = async (): Promise<Update[]> => {
  try {
    const response = await fetch(`${API_URL}/updates`);
    if (!response.ok) {
      throw new Error('Failed to fetch updates');
    }
    
    const updates = await response.json();
    return updates.map(formatUpdate);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return [];
  }
};

// Get currently reading papers
export const getCurrentlyReadingPapers = async (): Promise<Paper[]> => {
  try {
    const response = await fetch(`${API_URL}/papers/reading/current`);
    if (!response.ok) {
      throw new Error('Failed to fetch currently reading papers');
    }
    
    const papers = await response.json();
    return papers.map(formatPaper);
  } catch (error) {
    console.error('Error fetching currently reading papers:', error);
    return [];
  }
}; 
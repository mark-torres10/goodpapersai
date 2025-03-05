import React, { useState } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { gql, useMutation } from '@keystone-6/core/admin-ui/apollo';
import { Button } from '@keystone-ui/button';
import { TextInput, TextArea } from '@keystone-ui/fields';
import { css } from '@emotion/css';

// Define the ArXiv paper interface
interface ArxivPaper {
  title: string;
  authors: string;
  abstract: string;
  year: number;
  doi?: string;
  url: string;
  journal?: string;
}

// Extract the arxiv ID from a URL or ID string
const extractArxivId = (input: string): string | null => {
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
const fetchArxivPaper = async (arxivId: string): Promise<ArxivPaper> => {
  try {
    const response = await fetch(
      `http://export.arxiv.org/api/query?id_list=${arxivId}`
    );
    
    if (!response.ok) {
      throw new Error(`ArXiv API returned ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    // Check if there are entries
    const entries = xmlDoc.getElementsByTagName("entry");
    if (entries.length === 0) {
      throw new Error('No paper found for the given ArXiv ID');
    }
    
    const entry = entries[0];
    
    // Extract title
    const titleElement = entry.getElementsByTagName("title")[0];
    const title = titleElement ? titleElement.textContent?.replace(/\n/g, ' ').trim() : '';
    
    // Extract authors
    const authorElements = entry.getElementsByTagName("author");
    const authors = Array.from(authorElements)
      .map(authorEl => {
        const nameEl = authorEl.getElementsByTagName("name")[0];
        return nameEl ? nameEl.textContent : '';
      })
      .filter(Boolean)
      .join(', ');
    
    // Extract abstract
    const summaryElement = entry.getElementsByTagName("summary")[0];
    const abstract = summaryElement ? summaryElement.textContent?.replace(/\n/g, ' ').trim() : '';
    
    // Extract published date (for year)
    const publishedElement = entry.getElementsByTagName("published")[0];
    const published = publishedElement ? publishedElement.textContent : '';
    const year = published ? new Date(published).getFullYear() : new Date().getFullYear();
    
    // Extract URL
    const idElement = entry.getElementsByTagName("id")[0];
    const url = idElement ? idElement.textContent || '' : '';
    
    // Extract DOI and journal reference (these are specific to ArXiv and might need adjustments)
    const doiElement = Array.from(entry.getElementsByTagName("*")).find(el => el.tagName.includes("doi"));
    const doi = doiElement ? doiElement.textContent : '';
    
    const journalElement = Array.from(entry.getElementsByTagName("*")).find(el => el.tagName.includes("journal_ref"));
    const journal = journalElement ? journalElement.textContent : '';
    
    if (!title) throw new Error('Title not found in ArXiv response');
    
    return {
      title: title || '',
      authors: authors || '',
      abstract: abstract || '',
      year,
      url,
      doi: doi || undefined,
      journal: journal || undefined
    };
  } catch (error: any) {
    console.error('Error fetching ArXiv paper:', error);
    throw new Error(error.message || 'Failed to fetch paper from ArXiv');
  }
};

// GraphQL mutation to create a new paper
const CREATE_PAPER = gql`
  mutation CreatePaper($data: PaperCreateInput!) {
    createPaper(data: $data) {
      id
      title
    }
  }
`;

// Main component for the page
export default function ImportFromArxiv() {
  const [arxivUrl, setArxivUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaperFound, setIsPaperFound] = useState(false);
  const [paper, setPaper] = useState<ArxivPaper | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [createPaper, { loading: isCreating }] = useMutation(CREATE_PAPER);
  
  const handleArxivUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArxivUrl(e.target.value);
    setError(null);
    setIsSuccess(false);
  };
  
  const handleFetchPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsPaperFound(false);
    setIsSuccess(false);
    
    try {
      const arxivId = extractArxivId(arxivUrl);
      
      if (!arxivId) {
        throw new Error(`Invalid ArXiv URL or ID: ${arxivUrl}`);
      }
      
      const fetchedPaper = await fetchArxivPaper(arxivId);
      setPaper(fetchedPaper);
      setIsPaperFound(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch paper from ArXiv';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePaperChange = (field: keyof ArxivPaper, value: any) => {
    if (!paper) return;
    setPaper({ ...paper, [field]: value });
  };
  
  const handleCreatePaper = async () => {
    if (!paper) return;
    
    try {
      const result = await createPaper({
        variables: {
          data: {
            title: paper.title,
            authors: paper.authors,
            journal: paper.journal || '',
            year: paper.year,
            doi: paper.doi || '',
            url: paper.url,
            abstract: paper.abstract || '',
            isCurrentlyReading: false,
          },
        },
      });
      
      setIsSuccess(true);
      setIsPaperFound(false);
      setArxivUrl('');
      setPaper(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create paper';
      setError(`Error: ${errorMessage}`);
    }
  };
  
  const styles = {
    container: css`
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    `,
    formGroup: css`
      margin-bottom: 20px;
    `,
    label: css`
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
    `,
    error: css`
      color: red;
      margin-top: 8px;
    `,
    success: css`
      color: green;
      margin-top: 8px;
      padding: 12px;
      background-color: #e6f4ea;
      border-radius: 4px;
    `,
    buttonsContainer: css`
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    `,
    paper: css`
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    `,
    paperDetails: css`
      margin-top: 20px;
    `
  };
  
  return (
    <PageContainer header={<h1>Import Paper from ArXiv</h1>}>
      <div className={styles.container}>
        <div className={styles.paper}>
          {isSuccess && (
            <div className={styles.success}>
              Paper was successfully added to the database. You can <a href="/paper">view it in the list</a>.
            </div>
          )}
          
          {!isPaperFound ? (
            <form onSubmit={handleFetchPaper}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Enter an ArXiv paper URL or ID:</label>
                <TextInput
                  type="text"
                  value={arxivUrl}
                  onChange={handleArxivUrlChange}
                  placeholder="e.g., https://arxiv.org/abs/1706.03762 or 1706.03762"
                  disabled={isLoading}
                />
                {error && <div className={styles.error}>{error}</div>}
              </div>
              <Button
                type="submit"
                weight="bold"
                tone="active"
                isLoading={isLoading}
                isDisabled={isLoading || !arxivUrl.trim()}
              >
                {isLoading ? 'Loading...' : 'Find Paper'}
              </Button>
            </form>
          ) : (
            <div className={styles.paperDetails}>
              <h2>Paper Details</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Title</label>
                <TextInput
                  value={paper?.title || ''}
                  onChange={(e) => handlePaperChange('title', e.target.value)}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Authors</label>
                <TextInput
                  value={paper?.authors || ''}
                  onChange={(e) => handlePaperChange('authors', e.target.value)}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Year</label>
                <TextInput
                  type="number"
                  value={paper?.year.toString() || ''}
                  onChange={(e) => handlePaperChange('year', parseInt(e.target.value))}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Journal (if applicable)</label>
                <TextInput
                  value={paper?.journal || ''}
                  onChange={(e) => handlePaperChange('journal', e.target.value)}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>DOI (if applicable)</label>
                <TextInput
                  value={paper?.doi || ''}
                  onChange={(e) => handlePaperChange('doi', e.target.value)}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>URL</label>
                <TextInput
                  value={paper?.url || ''}
                  onChange={(e) => handlePaperChange('url', e.target.value)}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Abstract</label>
                <TextArea
                  value={paper?.abstract || ''}
                  onChange={(e) => handlePaperChange('abstract', e.target.value)}
                  height="200px"
                />
              </div>
              
              {error && <div className={styles.error}>{error}</div>}
              
              <div className={styles.buttonsContainer}>
                <Button onClick={() => setIsPaperFound(false)} weight="none" tone="passive">
                  Back
                </Button>
                <Button
                  onClick={handleCreatePaper}
                  weight="bold"
                  tone="active"
                  isLoading={isCreating}
                  isDisabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Add Paper'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
} 
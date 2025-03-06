/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx, Box } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { PlusIcon } from '@keystone-ui/icons/icons/PlusIcon';
import { useState, Fragment } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { List } from '@keystone-6/core/admin-ui/components';
import { gql, useMutation } from '@keystone-6/core/admin-ui/apollo';
import { TextInput, TextArea } from '@keystone-ui/fields';
import { Modal } from '@keystone-ui/modals';

// Define the ArXiv paper interface
interface ArXivPaper {
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
const fetchArxivPaper = async (arxivId: string): Promise<ArXivPaper> => {
  try {
    const response = await fetch(
      `https://export.arxiv.org/api/query?id_list=${arxivId}`
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

// Add Paper Modal Component
const AddPaperModal = ({ isOpen, onClose, onSuccess }: { 
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [arxivUrl, setArxivUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaperFound, setIsPaperFound] = useState(false);
  const [paper, setPaper] = useState<ArXivPaper | null>(null);
  
  const [createPaper, { loading: isCreating }] = useMutation(CREATE_PAPER);
  
  const handleArxivUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArxivUrl(e.target.value);
    setError(null);
  };
  
  const handleFetchPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsPaperFound(false);
    
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
  
  const handlePaperChange = (field: keyof ArXivPaper, value: any) => {
    if (!paper) return;
    setPaper({ ...paper, [field]: value });
  };
  
  const handleCreatePaper = async () => {
    if (!paper) return;
    
    try {
      await createPaper({
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
      
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create paper';
      setError(`Error: ${errorMessage}`);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Paper from ArXiv">
      <div css={{ padding: '24px' }}>
        {!isPaperFound ? (
          <form onSubmit={handleFetchPaper}>
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'bold', marginBottom: '8px' }}>Enter an ArXiv paper URL or ID:</div>
              <TextInput
                type="text"
                value={arxivUrl}
                onChange={handleArxivUrlChange}
                placeholder="e.g., https://arxiv.org/abs/1706.03762 or 1706.03762"
                disabled={isLoading}
              />
              {error && <div css={{ color: 'red', marginTop: '8px' }}>{error}</div>}
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
          <div>
            <div css={{ fontWeight: 'bold', marginBottom: '16px' }}>Paper Details</div>
            
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'medium', marginBottom: '8px' }}>Title</div>
              <TextInput
                value={paper?.title || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('title', e.target.value)}
              />
            </div>
            
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'medium', marginBottom: '8px' }}>Authors</div>
              <TextInput
                value={paper?.authors || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('authors', e.target.value)}
              />
            </div>
            
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'medium', marginBottom: '8px' }}>Year</div>
              <TextInput
                type="number"
                value={paper?.year.toString() || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('year', parseInt(e.target.value))}
              />
            </div>
            
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'medium', marginBottom: '8px' }}>Journal (if applicable)</div>
              <TextInput
                value={paper?.journal || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('journal', e.target.value)}
              />
            </div>
            
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'medium', marginBottom: '8px' }}>DOI (if applicable)</div>
              <TextInput
                value={paper?.doi || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('doi', e.target.value)}
              />
            </div>
            
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'medium', marginBottom: '8px' }}>URL</div>
              <TextInput
                value={paper?.url || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('url', e.target.value)}
              />
            </div>
            
            <div css={{ marginBottom: '16px' }}>
              <div css={{ fontWeight: 'medium', marginBottom: '8px' }}>Abstract</div>
              <TextArea
                value={paper?.abstract || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('abstract', e.target.value)}
                height="200px"
              />
            </div>
            
            {error && <div css={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
            
            <div css={{ display: 'flex', justifyContent: 'space-between' }}>
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
    </Modal>
  );
};

// Main component to display the custom paper list
function CustomPaperList() {
  const [isAddPaperModalOpen, setIsAddPaperModalOpen] = useState(false);

  const handleAddPaperSuccess = () => {
    // Refresh the list after adding a paper
    window.location.reload();
  };

  return (
    <PageContainer header={
      <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div css={{ fontSize: '24px', fontWeight: 'bold' }}>Papers</div>
        <Button
          size="small"
          tone="positive"
          weight="bold"
          onClick={() => setIsAddPaperModalOpen(true)}
        >
          <PlusIcon css={{ marginRight: '6px' }} />
          Add from ArXiv
        </Button>
      </div>
    }>
      {/* The default ListPage will be rendered here */}
      <List.ListView listKey="Paper" />
      
      {isAddPaperModalOpen && (
        <AddPaperModal
          isOpen={isAddPaperModalOpen}
          onClose={() => setIsAddPaperModalOpen(false)}
          onSuccess={handleAddPaperSuccess}
        />
      )}
    </PageContainer>
  );
}

export default CustomPaperList; 
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { gql, useMutation } from '@keystone-6/core/admin-ui/apollo';
import { Stack, Text, VisuallyHidden } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { TextInput, TextArea } from '@keystone-ui/fields';
import { Modal } from '@keystone-ui/modals';
import { fetchArxivPaper, extractArxivId, ArxivPaper } from '../arxiv-api';

const CREATE_PAPER = gql`
  mutation CreatePaper($data: PaperCreateInput!) {
    createPaper(data: $data) {
      id
      title
    }
  }
`;

const AddPaperModal = ({ isOpen, onClose, onSuccess }: { 
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [arxivUrl, setArxivUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaperFound, setIsPaperFound] = useState(false);
  const [paper, setPaper] = useState<ArxivPaper | null>(null);
  
  const [createPaper, { loading: isCreating }] = useMutation(CREATE_PAPER);
  
  const handleArxivUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArxivUrl(e.target.value);
    setError(null);
  };
  
  const handleFetchPaper = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsPaperFound(false);
    
    try {
      const arxivId = extractArxivId(arxivUrl);
      
      if (!arxivId) {
        throw new Error('Invalid ArXiv URL or ID');
      }
      
      const fetchedPaper = await fetchArxivPaper(arxivId);
      setPaper(fetchedPaper);
      setIsPaperFound(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch paper from ArXiv';
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create paper';
      setError(`Error: ${errorMessage}`);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Paper from ArXiv">
      <Stack gap="medium">
        {!isPaperFound ? (
          <form onSubmit={handleFetchPaper}>
            <Stack gap="medium">
              <Text>Enter an ArXiv paper URL or ID:</Text>
              <TextInput
                type="text"
                value={arxivUrl}
                onChange={handleArxivUrlChange}
                placeholder="e.g., https://arxiv.org/abs/1706.03762 or 1706.03762"
                disabled={isLoading}
              />
              {error && <Text color="red600">{error}</Text>}
              <Button
                type="submit"
                weight="bold"
                tone="active"
                isLoading={isLoading}
                isDisabled={isLoading || !arxivUrl.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" aria-hidden />
                    <VisuallyHidden>Loading...</VisuallyHidden>
                  </>
                ) : (
                  'Find Paper'
                )}
              </Button>
            </Stack>
          </form>
        ) : (
          <Stack gap="medium">
            <Text weight="bold">Paper Details</Text>
            <Stack gap="small">
              <Text weight="medium">Title</Text>
              <TextInput
                value={paper?.title || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('title', e.target.value)}
              />
            </Stack>
            <Stack gap="small">
              <Text weight="medium">Authors</Text>
              <TextInput
                value={paper?.authors || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('authors', e.target.value)}
              />
            </Stack>
            <Stack gap="small">
              <Text weight="medium">Year</Text>
              <TextInput
                type="number"
                value={paper?.year || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('year', parseInt(e.target.value))}
              />
            </Stack>
            <Stack gap="small">
              <Text weight="medium">Journal (if applicable)</Text>
              <TextInput
                value={paper?.journal || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('journal', e.target.value)}
              />
            </Stack>
            <Stack gap="small">
              <Text weight="medium">DOI (if applicable)</Text>
              <TextInput
                value={paper?.doi || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('doi', e.target.value)}
              />
            </Stack>
            <Stack gap="small">
              <Text weight="medium">URL</Text>
              <TextInput
                value={paper?.url || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('url', e.target.value)}
              />
            </Stack>
            <Stack gap="small">
              <Text weight="medium">Abstract</Text>
              <TextArea
                value={paper?.abstract || ''}
                onChange={(e: { target: { value: string } }) => handlePaperChange('abstract', e.target.value)}
                height="200px"
              />
            </Stack>
            {error && <Text color="red600">{error}</Text>}
            <Stack gap="small" across>
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
                {isCreating ? (
                  <>
                    <span className="spinner" aria-hidden />
                    <VisuallyHidden>Creating...</VisuallyHidden>
                  </>
                ) : (
                  'Add Paper'
                )}
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
};

export default AddPaperModal; 
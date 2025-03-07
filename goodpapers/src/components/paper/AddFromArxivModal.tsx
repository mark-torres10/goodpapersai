import React, { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { ArxivPaper, extractArxivId, fetchArxivPaper } from '../../services/arxiv-api';
import { Paper } from '../../types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #382110;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #767676;
  
  &:hover {
    color: #382110;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
`;

const Label = styled.label`
  font-weight: bold;
  color: #382110;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  background-color: ${props => props.primary ? '#382110' : '#e9e9e9'};
  color: ${props => props.primary ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.primary ? '#5c3d2e' : '#ddd'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #388e3c;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #e8f5e9;
  border-radius: 4px;
`;

// Reading status type
type ReadingStatus = 'add_to_library' | 'want_to_read' | 'started_reading' | 'finished_reading';

interface AddFromArxivModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFromArxivModal: React.FC<AddFromArxivModalProps> = ({ isOpen, onClose }) => {
  const [arxivUrl, setArxivUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paper, setPaper] = useState<ArxivPaper | null>(null);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>('add_to_library');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [existingPaper, setExistingPaper] = useState<any>(null);
  
  const handleArxivUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArxivUrl(e.target.value);
    setError(null);
    setIsDuplicate(false);
    setExistingPaper(null);
  };
  
  const handleFetchPaper = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setIsDuplicate(false);
    setExistingPaper(null);
    
    try {
      const arxivId = extractArxivId(arxivUrl);
      
      if (!arxivId) {
        throw new Error('Invalid ArXiv URL or ID. Please enter a valid ArXiv URL or ID.');
      }
      
      const paperData = await fetchArxivPaper(arxivId);
      
      // Check if the API returned a duplicate paper
      if (paperData.isDuplicate && paperData.existingPaper) {
        setIsDuplicate(true);
        setExistingPaper(paperData.existingPaper);
        // Set reading status to the existing paper's status
        setReadingStatus(paperData.existingPaper.readingStatus || 'add_to_library');
      }
      
      setPaper(paperData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch paper from ArXiv');
      setPaper(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaperChange = (field: keyof ArxivPaper, value: any) => {
    if (paper) {
      setPaper({ ...paper, [field]: value });
    }
  };
  
  const handleReadingStatusChange = (status: ReadingStatus) => {
    setReadingStatus(status);
  };
  
  const handleAddPaper = async () => {
    if (!paper) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending paper data:', paper);
      
      let response;
      
      if (isDuplicate && existingPaper) {
        // If it's a duplicate, update the reading status instead of adding a new paper
        response = await fetch(`/api/papers/${existingPaper.id}/reading-status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            readingStatus: readingStatus
          }),
        });
        
        if (response.ok) {
          setSuccess('Paper reading status updated successfully!');
        }
      } else {
        // Add a new paper if it's not a duplicate
        response = await fetch('/api/papers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: paper.title,
            authors: paper.authors,
            abstract: paper.abstract,
            year: paper.year,
            doi: paper.doi || '',
            url: paper.url,
            arxivLink: paper.arxivLink || paper.url, // Store ArXiv link explicitly
            journal: paper.journal || 'arXiv preprint',
            isCurrentlyReading: readingStatus === 'started_reading',
            readingStatus: readingStatus
          }),
        });
        
        if (response.ok) {
          const responseData = await response.json();
          
          if (responseData.isDuplicate) {
            // If the server found it was a duplicate even though we didn't catch it earlier
            setIsDuplicate(true);
            setExistingPaper(responseData);
            setSuccess('This paper is already in your library. Reading status has been updated!');
          } else {
            setSuccess('Paper added successfully!');
          }
        }
      }
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log('Error data:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.log('Could not parse error JSON:', jsonError);
          try {
            const textError = await response.text();
            console.log('Error text:', textError);
            errorMessage = textError || errorMessage;
          } catch (textError) {
            console.log('Could not get error text:', textError);
          }
        }
        throw new Error(errorMessage);
      }
      
      // Only clear the form if everything was successful
      setArxivUrl('');
      setPaper(null);
      setIsDuplicate(false);
      setExistingPaper(null);
      
      // Reload the page after 1.5 seconds to refresh the data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      console.error('Error adding paper:', err);
      setError(err.message || 'Failed to add paper');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  const renderDuplicateMessage = () => {
    if (isDuplicate && existingPaper) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This paper is already in your library. Current status: <strong>{formatReadingStatus(existingPaper.readingStatus)}</strong>
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Added on: {new Date(existingPaper.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Last updated: {new Date(existingPaper.updatedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                You can update its reading status below.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const formatReadingStatus = (status: string): string => {
    switch (status) {
      case 'want_to_read': return 'Want to Read';
      case 'started_reading': return 'Currently Reading';
      case 'finished_reading': return 'Finished Reading';
      case 'add_to_library': return 'In Library';
      default: return status;
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add Paper from ArXiv</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleFetchPaper}>
          <FormGroup>
            <Label htmlFor="arxivUrl">ArXiv URL or ID</Label>
            <Input
              id="arxivUrl"
              type="text"
              value={arxivUrl}
              onChange={handleArxivUrlChange}
              placeholder="e.g., https://arxiv.org/abs/1706.03762 or 1706.03762"
              disabled={loading}
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button type="submit" primary disabled={loading || !arxivUrl}>
              {loading ? 'Loading...' : 'Find Paper'}
            </Button>
          </ButtonGroup>
        </Form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        {paper && (
          <Form>
            {renderDuplicateMessage()}
            
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={paper.title}
                onChange={(e) => handlePaperChange('title', e.target.value)}
                disabled={loading || isDuplicate}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="authors">Authors</Label>
              <Input
                id="authors"
                type="text"
                value={paper.authors.join(', ')}
                onChange={(e) => handlePaperChange('authors', e.target.value.split(', '))}
                disabled={loading || isDuplicate}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="abstract">Abstract</Label>
              <TextArea
                id="abstract"
                value={paper.abstract}
                onChange={(e) => handlePaperChange('abstract', e.target.value)}
                disabled={loading || isDuplicate}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={paper.year}
                onChange={(e) => handlePaperChange('year', parseInt(e.target.value))}
                disabled={loading || isDuplicate}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="text"
                value={paper.url}
                onChange={(e) => handlePaperChange('url', e.target.value)}
                disabled={loading || isDuplicate}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="doi">DOI (Optional)</Label>
              <Input
                id="doi"
                type="text"
                value={paper.doi || ''}
                onChange={(e) => handlePaperChange('doi', e.target.value)}
                disabled={loading || isDuplicate}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="journal">Journal (Optional)</Label>
              <Input
                id="journal"
                type="text"
                value={paper.journal || ''}
                onChange={(e) => handlePaperChange('journal', e.target.value)}
                disabled={loading || isDuplicate}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Reading Status</Label>
              <ReadingStatusOptions>
                <ReadingStatusOption
                  selected={readingStatus === 'add_to_library'}
                  onClick={() => handleReadingStatusChange('add_to_library')}
                  disabled={loading}
                >
                  <RadioCircle selected={readingStatus === 'add_to_library'} />
                  <RadioLabel>Add to Library</RadioLabel>
                </ReadingStatusOption>
                
                <ReadingStatusOption
                  selected={readingStatus === 'want_to_read'}
                  onClick={() => handleReadingStatusChange('want_to_read')}
                  disabled={loading}
                >
                  <RadioCircle selected={readingStatus === 'want_to_read'} />
                  <RadioLabel>Want to Read</RadioLabel>
                </ReadingStatusOption>
                
                <ReadingStatusOption
                  selected={readingStatus === 'started_reading'}
                  onClick={() => handleReadingStatusChange('started_reading')}
                  disabled={loading}
                >
                  <RadioCircle selected={readingStatus === 'started_reading'} />
                  <RadioLabel>Started Reading</RadioLabel>
                </ReadingStatusOption>
                
                <ReadingStatusOption
                  selected={readingStatus === 'finished_reading'}
                  onClick={() => handleReadingStatusChange('finished_reading')}
                  disabled={loading}
                >
                  <RadioCircle selected={readingStatus === 'finished_reading'} />
                  <RadioLabel>Finished Reading</RadioLabel>
                </ReadingStatusOption>
              </ReadingStatusOptions>
            </FormGroup>
            
            <ButtonGroup>
              <Button type="button" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="button"
                primary
                onClick={handleAddPaper}
                disabled={loading}
              >
                {loading ? 'Processing...' : isDuplicate ? 'Update Status' : 'Add Paper'}
              </Button>
            </ButtonGroup>
          </Form>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

const ReadingStatusOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ReadingStatusOption = styled.div<{ selected: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ selected }) => (selected ? '#f0f7ff' : 'transparent')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  
  &:hover {
    background-color: ${({ selected, disabled }) => (disabled ? 'transparent' : selected ? '#e1efff' : '#f5f5f5')};
  }
`;

const RadioCircle = styled.div<{ selected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ selected }) => (selected ? '#0066cc' : '#aaa')};
  margin-right: 10px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #0066cc;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: ${({ selected }) => (selected ? 'block' : 'none')};
  }
`;

const RadioLabel = styled.span`
  font-size: 14px;
`;

export default AddFromArxivModal; 
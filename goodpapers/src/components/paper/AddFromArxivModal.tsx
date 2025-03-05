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
  
  const handleArxivUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setArxivUrl(e.target.value);
    setError(null);
  };
  
  const handleFetchPaper = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const arxivId = extractArxivId(arxivUrl);
      
      if (!arxivId) {
        throw new Error('Invalid ArXiv URL or ID. Please enter a valid ArXiv URL or ID.');
      }
      
      const paperData = await fetchArxivPaper(arxivId);
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
      
      const response = await fetch('http://localhost:3001/api/papers', {
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
          journal: paper.journal || 'arXiv preprint',
          isCurrentlyReading: readingStatus === 'started_reading',
          readingStatus: readingStatus
        }),
      });
      
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
      
      setSuccess('Paper added successfully!');
      setArxivUrl('');
      setPaper(null);
      
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
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={paper.title}
                onChange={(e) => handlePaperChange('title', e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="authors">Authors</Label>
              <Input
                id="authors"
                type="text"
                value={paper.authors.join(', ')}
                onChange={(e) => handlePaperChange('authors', e.target.value.split(', '))}
                disabled={loading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="abstract">Abstract</Label>
              <TextArea
                id="abstract"
                value={paper.abstract}
                onChange={(e) => handlePaperChange('abstract', e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={paper.year}
                onChange={(e) => handlePaperChange('year', parseInt(e.target.value))}
                disabled={loading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="text"
                value={paper.url}
                onChange={(e) => handlePaperChange('url', e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="doi">DOI (Optional)</Label>
              <Input
                id="doi"
                type="text"
                value={paper.doi || ''}
                onChange={(e) => handlePaperChange('doi', e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="journal">Journal (Optional)</Label>
              <Input
                id="journal"
                type="text"
                value={paper.journal || ''}
                onChange={(e) => handlePaperChange('journal', e.target.value)}
                disabled={loading}
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
                {loading ? 'Adding...' : 'Add Paper'}
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
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFromArxivModal from './AddFromArxivModal';
import * as arxivApi from '../../services/arxiv-api';

// Mock the arxiv-api module
jest.mock('../../services/arxiv-api');
const mockArxivApi = arxivApi;

// Mock extractArxivId to return valid ID for test URLs
mockArxivApi.extractArxivId.mockImplementation((url) => {
  if (url === 'invalid-url') return null;
  if (url === 'https://arxiv.org/abs/1234.5678') return '1234.5678';
  return null;
});

// Mock fetch function
const mockFetchResponse = (responseData, status = 200) => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve(JSON.stringify(responseData))
    });
  });
};

// Helper function to find buttons in container
const findButtonByText = (container, text) => {
  const buttons = container.querySelectorAll('button');
  return Array.from(buttons).find(
    button => button.textContent === text
  );
};

describe('AddFromArxivModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockArxivApi.extractArxivId.mockClear();
    mockArxivApi.fetchArxivPaper.mockClear();
    global.fetch = jest.fn();
  });

  it('renders correctly when open', () => {
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Add Paper from ArXiv')).toBeInTheDocument();
    expect(screen.getByLabelText('ArXiv URL or ID')).toBeInTheDocument();
    expect(screen.getByText('Find Paper')).toBeInTheDocument();
  });

  it('validates ArXiv URL input', async () => {
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid ArXiv URL or ID/)).toBeInTheDocument();
    });
  });

  it('displays paper details after fetching', async () => {
    mockArxivApi.fetchArxivPaper.mockResolvedValueOnce({
      title: 'Test Paper',
      authors: ['Author One', 'Author Two'],
      abstract: 'This is a test abstract',
      year: 2023,
      url: 'https://arxiv.org/abs/1234.5678',
      journal: 'arXiv preprint'
    });
    
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1234.5678' } });
    
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    await waitFor(() => {
      expect(screen.getByText('Paper Details')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Paper')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Author One, Author Two')).toBeInTheDocument();
    });
  });

  it('handles fetch errors', async () => {
    mockArxivApi.fetchArxivPaper.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1234.5678' } });
    
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
    });
  });

  it('adds paper successfully', async () => {
    // Setup mocks
    global.fetch = mockFetchResponse({ id: 1, title: 'Test Paper' });
    
    mockArxivApi.fetchArxivPaper.mockResolvedValueOnce({
      title: 'Test Paper',
      authors: ['Author One', 'Author Two'],
      abstract: 'This is a test abstract',
      year: 2023,
      url: 'https://arxiv.org/abs/1234.5678',
      journal: 'arXiv preprint'
    });
    
    const { container } = render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    // Input ArXiv URL
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1234.5678' } });
    
    // Click fetch button
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    // Wait for paper data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Paper Details')).toBeInTheDocument();
    });
    
    // Find and click add paper button by text content
    const addButton = findButtonByText(container, 'Add Paper');
    
    expect(addButton).toBeTruthy();
    if (addButton) {
      fireEvent.click(addButton);
    }
    
    // Check for success message instead of onClose being called
    await waitFor(() => {
      expect(screen.getByText(/successfully/)).toBeInTheDocument();
    });
  });

  it('handles add paper error', async () => {
    // Setup mocks
    global.fetch = mockFetchResponse({ error: 'Server error' }, 500);
    
    mockArxivApi.fetchArxivPaper.mockResolvedValueOnce({
      title: 'Test Paper',
      authors: ['Author One', 'Author Two'],
      abstract: 'This is a test abstract',
      year: 2023,
      url: 'https://arxiv.org/abs/1234.5678',
      journal: 'arXiv preprint'
    });
    
    const { container } = render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    // Input ArXiv URL
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1234.5678' } });
    
    // Click fetch button
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    // Wait for paper data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Paper Details')).toBeInTheDocument();
    });
    
    // Find and click add paper button
    const addButton = findButtonByText(container, 'Add Paper');
    
    expect(addButton).toBeTruthy();
    if (addButton) {
      fireEvent.click(addButton);
    }
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Server error/)).toBeInTheDocument();
    });
  });

  it('closes the modal when close button is clicked', () => {
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles duplicate paper detection', async () => {
    // Mock a paper that is a duplicate
    mockArxivApi.fetchArxivPaper.mockResolvedValueOnce({
      title: 'Duplicate Paper',
      authors: ['Author One', 'Author Two'],
      abstract: 'This is a test abstract',
      year: 2023,
      url: 'https://arxiv.org/abs/1234.5678',
      arxivLink: 'https://arxiv.org/abs/1234.5678',
      journal: 'arXiv preprint',
      isDuplicate: true,
      existingPaper: {
        id: 1,
        title: 'Duplicate Paper',
        authors: ['Author One', 'Author Two'],
        readingStatus: 'want_to_read',
        createdAt: '2023-06-15T12:00:00Z',
        updatedAt: '2023-06-15T12:00:00Z'
      }
    });
    
    const { container } = render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    // Input ArXiv URL
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1234.5678' } });
    
    // Click fetch button
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    // Wait for duplicate message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/already in your library/)).toBeInTheDocument();
    });
    
    // Mock the API response for the status update
    global.fetch = mockFetchResponse({ 
      id: 1, 
      title: 'Duplicate Paper',
      readingStatus: 'finished_reading'
    });
    
    // Change the reading status
    const statusRadio = screen.getByLabelText('Finished Reading');
    fireEvent.click(statusRadio);
    
    // Find and click update status button
    const updateButton = findButtonByText(container, 'Update Status');
    
    expect(updateButton).toBeTruthy();
    if (updateButton) {
      fireEvent.click(updateButton);
    }
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/updated successfully/)).toBeInTheDocument();
    });
  });
}); 
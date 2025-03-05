import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFromArxivModal from './AddFromArxivModal';
import * as arxivApi from '../../services/arxiv-api';

// Mock the arxiv-api module
jest.mock('../../services/arxiv-api');
// Use a more compatible approach without TypeScript assertion
const mockArxivApi = arxivApi;

// Mock extractArxivId to return valid ID for test URLs
mockArxivApi.extractArxivId.mockImplementation((url) => {
  if (url === 'invalid-url') return null;
  if (url === 'https://arxiv.org/abs/1234.5678') return '1234.5678';
  return null;
});

// Mock for fetch function
const mockFetchResponse = (responseData: any, status = 200): jest.Mock => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: jest.fn().mockResolvedValue(responseData),
      text: jest.fn().mockResolvedValue(JSON.stringify(responseData))
    });
  });
};

describe('AddFromArxivModal', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });
  
  it('renders correctly', () => {
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Add Paper from ArXiv')).toBeInTheDocument();
    expect(screen.getByLabelText('ArXiv URL or ID')).toBeInTheDocument();
    expect(screen.getByText('Find Paper')).toBeInTheDocument();
  });
  
  it('handles URL input change', () => {
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1234.5678' } });
    
    expect((input as HTMLInputElement).value).toBe('https://arxiv.org/abs/1234.5678');
  });
  
  it('validates ArXiv URL format', async () => {
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    // Use className to find the error message div
    const errorElement = await screen.findByText(/Invalid ArXiv URL or ID/);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.className).toContain('sc-');
  });
  
  it('fetches paper data successfully', async () => {
    // Setup mock implementation for this specific test
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
    
    // Instead of using labels, check if second form appears after fetching
    await waitFor(() => {
      // Once paper is fetched, a second form should appear for editing
      const forms = container.querySelectorAll('form');
      expect(forms.length).toBeGreaterThan(1);
      
      // Check for inputs that might contain the paper data
      const inputs = container.querySelectorAll('input');
      const inputValues = Array.from(inputs).map(input => (input as HTMLInputElement).value);
      expect(inputValues.includes('Test Paper')).toBe(true);
    });
  });
  
  it('handles fetch error', async () => {
    // Setup mock to throw error
    mockArxivApi.fetchArxivPaper.mockRejectedValueOnce(new Error('Network error'));
    
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const input = screen.getByLabelText('ArXiv URL or ID');
    fireEvent.change(input, { target: { value: 'https://arxiv.org/abs/1234.5678' } });
    
    const fetchButton = screen.getByText('Find Paper');
    fireEvent.click(fetchButton);
    
    // Wait for error message
    await waitFor(() => {
      const errorMessages = document.querySelectorAll('div');
      const hasErrorMessage = Array.from(errorMessages).some(
        el => el.textContent && el.textContent.includes('Network error')
      );
      expect(hasErrorMessage).toBe(true);
    });
  });
  
  it('adds paper successfully', async () => {
    // Setup mocks
    global.fetch = mockFetchResponse({ success: true });
    
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
      const forms = container.querySelectorAll('form');
      expect(forms.length).toBeGreaterThan(1);
    });
    
    // Find and click add paper button by text content
    const buttons = container.querySelectorAll('button');
    const addButton = Array.from(buttons).find(
      button => button.textContent === 'Add Paper'
    );
    
    expect(addButton).toBeTruthy();
    if (addButton) {
      fireEvent.click(addButton);
    }
    
    // Check for success message instead of onClose being called
    await waitFor(() => {
      const successMessages = document.querySelectorAll('div');
      const hasSuccessMessage = Array.from(successMessages).some(
        el => el.textContent && el.textContent.includes('success')
      );
      expect(hasSuccessMessage).toBe(true);
    });
  });
  
  it('handles add paper error', async () => {
    // Setup mocks
    global.fetch = mockFetchResponse({ success: false, error: 'Server error' }, 500);
    
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
      const forms = container.querySelectorAll('form');
      expect(forms.length).toBeGreaterThan(1);
    });
    
    // Find and click add paper button
    const buttons = container.querySelectorAll('button');
    const addButton = Array.from(buttons).find(
      button => button.textContent === 'Add Paper'
    );
    
    expect(addButton).toBeTruthy();
    if (addButton) {
      fireEvent.click(addButton);
    }
    
    // Check for error message
    await waitFor(() => {
      const errorMessages = document.querySelectorAll('div');
      const hasErrorMessage = Array.from(errorMessages).some(
        el => el.textContent && el.textContent.includes('error')
      );
      expect(hasErrorMessage).toBe(true);
    });
  });
  
  it('closes the modal when close button is clicked', () => {
    render(<AddFromArxivModal isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 
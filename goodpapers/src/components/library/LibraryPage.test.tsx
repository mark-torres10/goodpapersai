import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LibraryPage from './LibraryPage';
import * as api from '../../services/api';
import { Paper } from '../../types';

// Auto mock react-router-dom (using the __mocks__ directory)
jest.mock('react-router-dom');

// Mock the api module
jest.mock('../../services/api');
const mockApi = api as jest.Mocked<typeof api>;

const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Paper 1',
    authors: ['Author 1'],
    year: 2022,
    readingStatus: 'add_to_library'
  },
  {
    id: '2',
    title: 'Paper 2',
    authors: ['Author 2'],
    year: 2021,
    readingStatus: 'want_to_read'
  },
  {
    id: '3',
    title: 'Paper 3',
    authors: ['Author 3'],
    year: 2023,
    readingStatus: 'started_reading'
  },
  {
    id: '4',
    title: 'Paper 4',
    authors: ['Author 4'],
    year: 2020,
    readingStatus: 'finished_reading'
  }
];

describe('LibraryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.getAllPapers.mockResolvedValue(mockPapers);
    mockApi.createPaperSlug.mockImplementation((title, year) => `${title.toLowerCase().replace(/\s+/g, '-')}-${year}`);
  });

  const renderLibraryPage = () => {
    return render(<LibraryPage />);
  };

  test('renders the library page with tabs', async () => {
    renderLibraryPage();

    // Wait for papers to load
    await waitFor(() => {
      expect(mockApi.getAllPapers).toHaveBeenCalledTimes(1);
    });

    // Check if all tabs are rendered
    expect(screen.getByTestId('tab-all')).toHaveTextContent('All Papers');
    expect(screen.getByTestId('tab-want-to-read')).toHaveTextContent('Want to Read');
    expect(screen.getByTestId('tab-started-reading')).toHaveTextContent('Currently Reading');
    expect(screen.getByTestId('tab-finished-reading')).toHaveTextContent('Finished Reading');
    
    // Initially "All Papers" tab should be active
    expect(screen.getByTestId('tab-all')).toHaveStyle('font-weight: bold');
  });

  test('shows all papers when "All Papers" tab is active', async () => {
    renderLibraryPage();

    // Wait for papers to load
    await waitFor(() => {
      expect(mockApi.getAllPapers).toHaveBeenCalledTimes(1);
    });

    // Should display all 4 papers
    expect(screen.getByText('Paper 1')).toBeInTheDocument();
    expect(screen.getByText('Paper 2')).toBeInTheDocument();
    expect(screen.getByText('Paper 3')).toBeInTheDocument();
    expect(screen.getByText('Paper 4')).toBeInTheDocument();
  });

  test('filters papers when "Want to Read" tab is clicked', async () => {
    renderLibraryPage();

    // Wait for papers to load
    await waitFor(() => {
      expect(mockApi.getAllPapers).toHaveBeenCalledTimes(1);
    });

    // Click "Want to Read" tab
    fireEvent.click(screen.getByTestId('tab-want-to-read'));

    // Should only display Paper 2
    expect(screen.queryByText('Paper 1')).not.toBeInTheDocument();
    expect(screen.getByText('Paper 2')).toBeInTheDocument();
    expect(screen.queryByText('Paper 3')).not.toBeInTheDocument();
    expect(screen.queryByText('Paper 4')).not.toBeInTheDocument();
    
    // "Want to Read" tab should now be active
    expect(screen.getByTestId('tab-want-to-read')).toHaveStyle('font-weight: bold');
  });

  test('filters papers when "Currently Reading" tab is clicked', async () => {
    renderLibraryPage();

    // Wait for papers to load
    await waitFor(() => {
      expect(mockApi.getAllPapers).toHaveBeenCalledTimes(1);
    });

    // Click "Currently Reading" tab
    fireEvent.click(screen.getByTestId('tab-started-reading'));

    // Should only display Paper 3
    expect(screen.queryByText('Paper 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Paper 2')).not.toBeInTheDocument();
    expect(screen.getByText('Paper 3')).toBeInTheDocument();
    expect(screen.queryByText('Paper 4')).not.toBeInTheDocument();
  });

  test('filters papers when "Finished Reading" tab is clicked', async () => {
    renderLibraryPage();

    // Wait for papers to load
    await waitFor(() => {
      expect(mockApi.getAllPapers).toHaveBeenCalledTimes(1);
    });

    // Click "Finished Reading" tab
    fireEvent.click(screen.getByTestId('tab-finished-reading'));

    // Should only display Paper 4
    expect(screen.queryByText('Paper 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Paper 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Paper 3')).not.toBeInTheDocument();
    expect(screen.getByText('Paper 4')).toBeInTheDocument();
  });

  test('shows message when no papers match the selected filter', async () => {
    // Override the mock to return empty array
    mockApi.getAllPapers.mockResolvedValue([]);
    
    renderLibraryPage();

    // Wait for papers to load
    await waitFor(() => {
      expect(mockApi.getAllPapers).toHaveBeenCalledTimes(1);
    });

    // Should display empty message
    expect(screen.getByText('No papers found in this category.')).toBeInTheDocument();
  });
}); 
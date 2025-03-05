import { filterPapersByReadingStatus } from './paperUtils';
import { Paper } from '../types';

describe('paperUtils', () => {
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

  describe('filterPapersByReadingStatus', () => {
    test('returns all papers when status is "all"', () => {
      const result = filterPapersByReadingStatus(mockPapers, 'all');
      expect(result).toHaveLength(4);
      expect(result).toEqual(mockPapers);
    });

    test('filters papers with "add_to_library" status', () => {
      const result = filterPapersByReadingStatus(mockPapers, 'add_to_library');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('filters papers with "want_to_read" status', () => {
      const result = filterPapersByReadingStatus(mockPapers, 'want_to_read');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    test('filters papers with "started_reading" status', () => {
      const result = filterPapersByReadingStatus(mockPapers, 'started_reading');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    test('filters papers with "finished_reading" status', () => {
      const result = filterPapersByReadingStatus(mockPapers, 'finished_reading');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    test('returns empty array when no papers match the status', () => {
      const emptyResult = filterPapersByReadingStatus([], 'want_to_read');
      expect(emptyResult).toHaveLength(0);
      
      const noMatchResult = filterPapersByReadingStatus(
        [{ id: '5', title: 'Paper 5', authors: ['Author 5'], year: 2024 }], 
        'want_to_read'
      );
      expect(noMatchResult).toHaveLength(0);
    });
  });
}); 
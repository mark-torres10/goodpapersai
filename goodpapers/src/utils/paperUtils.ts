import { Paper, ReadingStatus } from '../types';

type TabOption = 'all' | ReadingStatus;

/**
 * Filter papers based on reading status
 * @param papers List of papers to filter
 * @param readingStatus Filter criteria ('all' or specific reading status)
 * @returns Filtered list of papers
 */
export const filterPapersByReadingStatus = (papers: Paper[], readingStatus: TabOption): Paper[] => {
  if (readingStatus === 'all') {
    return papers;
  }
  
  return papers.filter(paper => paper.readingStatus === readingStatus);
}; 
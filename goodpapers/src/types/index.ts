export interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  url?: string;
  doi?: string;
  abstract?: string;
  isCurrentlyReading?: boolean;
  readingStatus?: ReadingStatus;
}

export type ReadingStatus = 'add_to_library' | 'want_to_read' | 'started_reading' | 'finished_reading';

export interface Update {
  id: string;
  paperTitle: string;
  message: string;
  timestamp: Date;
  readingStatus?: ReadingStatus;
} 
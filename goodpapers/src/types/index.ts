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
}

export interface Update {
  id: string;
  paperTitle: string;
  message: string;
  timestamp: Date;
} 
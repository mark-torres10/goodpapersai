import React from 'react';
import styled from 'styled-components';
import { Paper, Update } from '../../types';
import CurrentlyReadingSection from './CurrentlyReadingSection';
import UpdatesSection from './UpdatesSection';

const HomeContainer = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CurrentlyReadingColumn = styled.div`
  flex: 1;
`;

const UpdatesColumn = styled.div`
  flex: 2;
`;

// Sample data
const samplePapers: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    journal: 'Advances in Neural Information Processing Systems',
    year: 2017,
    doi: '10.48550/arXiv.1706.03762',
    isCurrentlyReading: true
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    year: 2018,
    journal: 'arXiv preprint',
    doi: '10.48550/arXiv.1810.04805',
    isCurrentlyReading: true
  }
];

const sampleUpdates: Update[] = [
  {
    id: '1',
    paperTitle: 'Attention Is All You Need',
    message: 'Started reading',
    timestamp: new Date(2023, 5, 10)
  },
  {
    id: '2',
    paperTitle: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    message: 'Added to library',
    timestamp: new Date(2023, 5, 8)
  },
  {
    id: '3',
    paperTitle: 'Attention Is All You Need',
    message: 'Finished reading',
    timestamp: new Date(2023, 5, 15)
  }
];

const HomePage: React.FC = () => {
  const currentlyReading = samplePapers.filter(paper => paper.isCurrentlyReading);
  
  return (
    <HomeContainer>
      <CurrentlyReadingColumn>
        <CurrentlyReadingSection papers={currentlyReading} />
      </CurrentlyReadingColumn>
      <UpdatesColumn>
        <UpdatesSection updates={sampleUpdates} />
      </UpdatesColumn>
    </HomeContainer>
  );
};

export default HomePage; 
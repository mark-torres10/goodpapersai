import React from 'react';
import styled from 'styled-components';
import { Paper } from '../../types';
import PaperRow from './PaperRow';

const LibraryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #382110;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const PapersList = styled.div`
  background-color: #f9f7f4;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  },
  {
    id: '3',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder', 'Melanie Subbiah', 'Jared Kaplan', 'Prafulla Dhariwal', 'et al.'],
    year: 2020,
    journal: 'Advances in Neural Information Processing Systems',
    doi: '10.48550/arXiv.2005.14165'
  },
  {
    id: '4',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    year: 2016,
    journal: 'IEEE Conference on Computer Vision and Pattern Recognition',
    doi: '10.1109/CVPR.2016.90'
  }
];

const LibraryPage: React.FC = () => {
  const handlePaperClick = (paperId: string) => {
    console.log(`Paper clicked: ${paperId}`);
    // In a real application, this would navigate to a paper detail page
    // or open a modal with more details
  };

  return (
    <LibraryContainer>
      <Title>My Library</Title>
      <PapersList>
        {samplePapers.length === 0 ? (
          <p>Your library is empty. Start adding papers!</p>
        ) : (
          samplePapers.map(paper => (
            <PaperRow 
              key={paper.id} 
              paper={paper} 
              onClick={() => handlePaperClick(paper.id)} 
            />
          ))
        )}
      </PapersList>
    </LibraryContainer>
  );
};

export default LibraryPage; 
import React from 'react';
import styled from 'styled-components';
import { Paper } from '../../types';

const SectionContainer = styled.div`
  background-color: #f9f7f4;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #382110;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const PaperItem = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const PaperTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333333;
`;

const PaperAuthors = styled.p`
  margin: 0 0 0.5rem 0;
  color: #767676;
  font-size: 0.9rem;
`;

interface CurrentlyReadingSectionProps {
  papers: Paper[];
}

const CurrentlyReadingSection: React.FC<CurrentlyReadingSectionProps> = ({ papers }) => {
  return (
    <SectionContainer>
      <SectionTitle>Currently Reading</SectionTitle>
      {papers.length === 0 ? (
        <p>You're not currently reading any papers.</p>
      ) : (
        papers.map(paper => (
          <PaperItem key={paper.id}>
            <PaperTitle>{paper.title}</PaperTitle>
            <PaperAuthors>{paper.authors.join(', ')}</PaperAuthors>
          </PaperItem>
        ))
      )}
    </SectionContainer>
  );
};

export default CurrentlyReadingSection; 
import React from 'react';
import styled from 'styled-components';
import { Paper } from '../../types';

const RowContainer = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f0ebe5;
  }
`;

const PaperTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333333;
`;

const Citation = styled.p`
  margin: 0;
  color: #767676;
  font-size: 0.9rem;
`;

interface PaperRowProps {
  paper: Paper;
  onClick: () => void;
}

// Helper function to generate MLA citation
const generateMLACitation = (paper: Paper): string => {
  let citation = '';
  
  // Authors
  if (paper.authors.length === 1) {
    citation += `${paper.authors[0]}.`;
  } else if (paper.authors.length === 2) {
    citation += `${paper.authors[0]} and ${paper.authors[1]}.`;
  } else if (paper.authors.length > 2) {
    citation += `${paper.authors[0]} et al.`;
  }
  
  // Title
  citation += ` "${paper.title}."`;
  
  // Journal
  if (paper.journal) {
    citation += ` ${paper.journal},`;
  }
  
  // Year
  citation += ` ${paper.year}.`;
  
  // DOI
  if (paper.doi) {
    citation += ` DOI: ${paper.doi}`;
  }
  
  return citation;
};

const PaperRow: React.FC<PaperRowProps> = ({ paper, onClick }) => {
  return (
    <RowContainer onClick={onClick}>
      <PaperTitle>{paper.title}</PaperTitle>
      <Citation>{generateMLACitation(paper)}</Citation>
    </RowContainer>
  );
};

export default PaperRow; 
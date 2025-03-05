import React from 'react';
import styled from 'styled-components';
import { Update } from '../../types';

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

const UpdateItem = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const UpdatePaperTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333333;
`;

const UpdateMessage = styled.p`
  margin: 0 0 0.5rem 0;
  color: #333333;
  font-size: 0.9rem;
`;

const UpdateTimestamp = styled.p`
  margin: 0;
  color: #767676;
  font-size: 0.8rem;
`;

interface UpdatesSectionProps {
  updates: Update[];
}

const UpdatesSection: React.FC<UpdatesSectionProps> = ({ updates }) => {
  // Sort updates by timestamp (newest first)
  const sortedUpdates = [...updates].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <SectionContainer>
      <SectionTitle>Updates</SectionTitle>
      {sortedUpdates.length === 0 ? (
        <p>No recent updates.</p>
      ) : (
        sortedUpdates.map(update => (
          <UpdateItem key={update.id}>
            <UpdatePaperTitle>{update.paperTitle}</UpdatePaperTitle>
            <UpdateMessage>{update.message}</UpdateMessage>
            <UpdateTimestamp>{update.timestamp.toLocaleDateString()}</UpdateTimestamp>
          </UpdateItem>
        ))
      )}
    </SectionContainer>
  );
};

export default UpdatesSection; 
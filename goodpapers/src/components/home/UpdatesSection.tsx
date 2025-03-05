import React from 'react';
import styled from 'styled-components';
import { Update, ReadingStatus } from '../../types';

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

const UpdateHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StatusIndicator = styled.div<{ status?: ReadingStatus }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ status }) => {
    switch (status) {
      case 'want_to_read':
        return 'background-color: #E8F4F8; color: #0099cc;';
      case 'started_reading':
        return 'background-color: #f3e9d2; color: #cc9900;';
      case 'finished_reading':
        return 'background-color: #e9f5e9; color: #2e7d32;';
      default:
        return 'background-color: #f5f5f5; color: #757575;';
    }
  }}
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

const getStatusIcon = (status?: ReadingStatus): string => {
  switch (status) {
    case 'want_to_read':
      return '📚'; // Bookshelf icon
    case 'started_reading':
      return '🔖'; // Bookmark icon
    case 'finished_reading':
      return '✓'; // Checkmark
    default:
      return '📄'; // Document icon
  }
};

const getStatusText = (message: string, status?: ReadingStatus): string => {
  // If the message already contains status info, just return it
  if (message.includes('Added to') || 
      message.includes('Started reading') || 
      message.includes('Finished reading')) {
    return message;
  }
  
  // Otherwise, prepend status info to the message
  switch (status) {
    case 'want_to_read':
      return `Added to "Want to Read" list`;
    case 'started_reading':
      return `Started reading`;
    case 'finished_reading':
      return `Finished reading`;
    default:
      return message;
  }
};

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
            <UpdateHeader>
              <StatusIndicator status={update.readingStatus}>
                {getStatusIcon(update.readingStatus)}
              </StatusIndicator>
              <UpdatePaperTitle>{update.paperTitle}</UpdatePaperTitle>
            </UpdateHeader>
            <UpdateMessage>
              {getStatusText(update.message, update.readingStatus)}
            </UpdateMessage>
            <UpdateTimestamp>{update.timestamp.toLocaleDateString()}</UpdateTimestamp>
          </UpdateItem>
        ))
      )}
    </SectionContainer>
  );
};

export default UpdatesSection; 
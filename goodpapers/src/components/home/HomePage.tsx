import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Paper, Update } from '../../types';
import CurrentlyReadingSection from './CurrentlyReadingSection';
import UpdatesSection from './UpdatesSection';
import { getCurrentlyReadingPapers, getAllUpdates } from '../../services/api';

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

const LoadingMessage = styled.p`
  color: #767676;
`;

const ErrorMessage = styled.p`
  color: #b30000;
`;

const HomePage: React.FC = () => {
  const [currentlyReading, setCurrentlyReading] = useState<Paper[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [readingPapers, paperUpdates] = await Promise.all([
          getCurrentlyReadingPapers(),
          getAllUpdates()
        ]);
        
        setCurrentlyReading(readingPapers);
        setUpdates(paperUpdates);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <HomeContainer>
        <LoadingMessage>Loading data...</LoadingMessage>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </HomeContainer>
    );
  }
  
  return (
    <HomeContainer>
      <CurrentlyReadingColumn>
        <CurrentlyReadingSection papers={currentlyReading} />
      </CurrentlyReadingColumn>
      <UpdatesColumn>
        <UpdatesSection updates={updates} />
      </UpdatesColumn>
    </HomeContainer>
  );
};

export default HomePage; 
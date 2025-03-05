import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Paper } from '../../types';
import PaperRow from './PaperRow';
import { getAllPapers, createPaperSlug } from '../../services/api';

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

const LoadingMessage = styled.p`
  color: #767676;
`;

const ErrorMessage = styled.p`
  color: #b30000;
`;

const LibraryPage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const fetchedPapers = await getAllPapers();
        setPapers(fetchedPapers);
      } catch (err) {
        setError('Failed to load papers');
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  const handlePaperClick = (paper: Paper) => {
    const slug = createPaperSlug(paper.title, paper.year);
    navigate(`/library/${slug}`);
  };

  if (loading) {
    return (
      <LibraryContainer>
        <Title>My Library</Title>
        <LoadingMessage>Loading papers...</LoadingMessage>
      </LibraryContainer>
    );
  }

  if (error) {
    return (
      <LibraryContainer>
        <Title>My Library</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </LibraryContainer>
    );
  }

  return (
    <LibraryContainer>
      <Title>My Library</Title>
      <PapersList>
        {papers.length === 0 ? (
          <p>Your library is empty. Start adding papers!</p>
        ) : (
          papers.map(paper => (
            <PaperRow 
              key={paper.id} 
              paper={paper} 
              onClick={() => handlePaperClick(paper)} 
            />
          ))
        )}
      </PapersList>
    </LibraryContainer>
  );
};

export default LibraryPage; 
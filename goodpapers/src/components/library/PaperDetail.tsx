import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Paper } from '../../types';
import { getPaperBySlug } from '../../services/api';

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #767676;
  text-decoration: none;
  
  &:hover {
    color: #382110;
    text-decoration: underline;
  }
`;

const PaperTitle = styled.h1`
  color: #382110;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: bold;
`;

const Citation = styled.p`
  margin-bottom: 2rem;
  color: #767676;
  font-size: 0.9rem;
  font-style: italic;
`;

const Abstract = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const AbstractTitle = styled.h2`
  color: #382110;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.p`
  color: #767676;
`;

const ErrorMessage = styled.p`
  color: #b30000;
`;

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

const PaperDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        if (!slug) {
          setError('Paper slug is missing');
          setLoading(false);
          return;
        }

        const fetchedPaper = await getPaperBySlug(slug);
        
        if (fetchedPaper) {
          setPaper(fetchedPaper);
        } else {
          setError('Paper not found');
        }
      } catch (err) {
        setError('Failed to load paper details');
        console.error('Error fetching paper:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [slug]);

  if (loading) {
    return (
      <DetailContainer>
        <LoadingMessage>Loading paper details...</LoadingMessage>
      </DetailContainer>
    );
  }

  if (error || !paper) {
    return (
      <DetailContainer>
        <BackLink to="/library">← Back to Library</BackLink>
        <ErrorMessage>{error || 'Paper not found'}</ErrorMessage>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackLink to="/library">← Back to Library</BackLink>
      <PaperTitle>{paper.title}</PaperTitle>
      <Citation>{generateMLACitation(paper)}</Citation>
      
      <Abstract>
        <AbstractTitle>Abstract</AbstractTitle>
        <p>{paper.abstract || 'No abstract available for this paper.'}</p>
      </Abstract>
    </DetailContainer>
  );
};

export default PaperDetail; 
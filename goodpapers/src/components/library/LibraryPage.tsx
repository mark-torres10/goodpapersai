import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Paper, ReadingStatus } from '../../types';
import PaperRow from './PaperRow';
import { getAllPapers, createPaperSlug } from '../../services/api';
import { filterPapersByReadingStatus } from '../../utils/paperUtils';

const LibraryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;
`;

const TabsContainer = styled.div`
  width: 200px;
  flex-shrink: 0;
`;

const TabButton = styled.button<{ active: boolean }>`
  display: block;
  width: 100%;
  padding: 1rem;
  text-align: left;
  background-color: ${props => props.active ? '#f4f1ea' : 'transparent'};
  border: none;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: #382110;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f4f1ea;
  }
`;

const ContentContainer = styled.div`
  flex-grow: 1;
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

// Define the tab options
type TabOption = 'all' | ReadingStatus;

const LibraryPage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabOption>('all');
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

  const handleTabClick = (tab: TabOption) => {
    setActiveTab(tab);
  };

  // Get filtered papers using the utility function
  const filteredPapers = filterPapersByReadingStatus(papers, activeTab);

  if (loading) {
    return (
      <LibraryContainer>
        <TabsContainer>
          <TabButton active={true} onClick={() => {}} data-testid="tab-all">All Papers</TabButton>
          <TabButton active={false} onClick={() => {}} data-testid="tab-want-to-read">Want to Read</TabButton>
          <TabButton active={false} onClick={() => {}} data-testid="tab-started-reading">Currently Reading</TabButton>
          <TabButton active={false} onClick={() => {}} data-testid="tab-finished-reading">Finished Reading</TabButton>
        </TabsContainer>
        <ContentContainer>
          <Title>My Library</Title>
          <LoadingMessage>Loading papers...</LoadingMessage>
        </ContentContainer>
      </LibraryContainer>
    );
  }

  if (error) {
    return (
      <LibraryContainer>
        <TabsContainer>
          <TabButton active={true} onClick={() => {}} data-testid="tab-all">All Papers</TabButton>
          <TabButton active={false} onClick={() => {}} data-testid="tab-want-to-read">Want to Read</TabButton>
          <TabButton active={false} onClick={() => {}} data-testid="tab-started-reading">Currently Reading</TabButton>
          <TabButton active={false} onClick={() => {}} data-testid="tab-finished-reading">Finished Reading</TabButton>
        </TabsContainer>
        <ContentContainer>
          <Title>My Library</Title>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentContainer>
      </LibraryContainer>
    );
  }

  return (
    <LibraryContainer data-testid="library-page">
      <TabsContainer>
        <TabButton 
          active={activeTab === 'all'} 
          onClick={() => handleTabClick('all')} 
          data-testid="tab-all"
        >
          All Papers
        </TabButton>
        <TabButton 
          active={activeTab === 'want_to_read'} 
          onClick={() => handleTabClick('want_to_read')} 
          data-testid="tab-want-to-read"
        >
          Want to Read
        </TabButton>
        <TabButton 
          active={activeTab === 'started_reading'} 
          onClick={() => handleTabClick('started_reading')} 
          data-testid="tab-started-reading"
        >
          Currently Reading
        </TabButton>
        <TabButton 
          active={activeTab === 'finished_reading'} 
          onClick={() => handleTabClick('finished_reading')} 
          data-testid="tab-finished-reading"
        >
          Finished Reading
        </TabButton>
      </TabsContainer>
      <ContentContainer>
        <Title>My Library</Title>
        <PapersList>
          {filteredPapers.length === 0 ? (
            <p>No papers found in this category.</p>
          ) : (
            filteredPapers.map(paper => (
              <PaperRow 
                key={paper.id} 
                paper={paper} 
                onClick={() => handlePaperClick(paper)} 
              />
            ))
          )}
        </PapersList>
      </ContentContainer>
    </LibraryContainer>
  );
};

export default LibraryPage; 
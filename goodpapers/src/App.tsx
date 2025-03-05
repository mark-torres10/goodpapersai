import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/layout/Navbar';
import HomePage from './components/home/HomePage';
import LibraryPage from './components/library/LibraryPage';
import PaperDetail from './components/library/PaperDetail';

const AppContainer = styled.div`
  font-family: 'Merriweather', 'Georgia', serif;
  color: #333333;
  background-color: #ffffff;
  min-height: 100vh;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:slug" element={<PaperDetail />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;

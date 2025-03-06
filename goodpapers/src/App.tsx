import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/layout/Navbar';
import HomePage from './components/home/HomePage';
import LibraryPage from './components/library/LibraryPage';
import PaperDetail from './components/library/PaperDetail';
import LoginPage from './components/auth/LoginPage';
import CreateAccountPage from './components/auth/CreateAccountPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const AppContainer = styled.div`
  font-family: 'Merriweather', 'Georgia', serif;
  color: #333333;
  background-color: #ffffff;
  min-height: 100vh;
`;

const Content = styled.div`
  min-height: calc(100vh - 64px); /* Account for navbar height */
`;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route 
                path="/home" 
                element={
                  <>
                    <Navbar />
                    <Content>
                      <HomePage />
                    </Content>
                  </>
                } 
              />
              <Route 
                path="/library" 
                element={
                  <>
                    <Navbar />
                    <Content>
                      <LibraryPage />
                    </Content>
                  </>
                } 
              />
              <Route 
                path="/library/:slug" 
                element={
                  <>
                    <Navbar />
                    <Content>
                      <PaperDetail />
                    </Content>
                  </>
                } 
              />
            </Route>
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
};

export default App;

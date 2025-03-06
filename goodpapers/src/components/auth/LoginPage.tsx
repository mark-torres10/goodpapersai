import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const LoginButton = styled.button`
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3367D6;
  }
`;

const GoogleIcon = styled.span`
  margin-right: 10px;
  font-weight: bold;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #ffebee;
`;

const LoginPage: React.FC = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  // Extract error message from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    
    if (errorParam) {
      switch (errorParam) {
        case 'google-auth-failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'session-expired':
          setError('Your session has expired. Please log in again.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }
  }, [location.search]);
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/home');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleGoogleLogin = () => {
    login();
  };
  
  if (isLoading) {
    return (
      <LoginContainer>
        <LoginCard>
          <Title>Loading...</Title>
        </LoginCard>
      </LoginContainer>
    );
  }
  
  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome to GoodPapers</Title>
        <Subtitle>Sign in to manage your research papers</Subtitle>
        
        <LoginButton onClick={handleGoogleLogin}>
          <GoogleIcon>G</GoogleIcon> Sign in with Google
        </LoginButton>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage; 
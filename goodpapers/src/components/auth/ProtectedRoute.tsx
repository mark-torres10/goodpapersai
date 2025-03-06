import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const LoadingText = styled.h2`
  color: #333;
`;

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }
  
  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute; 
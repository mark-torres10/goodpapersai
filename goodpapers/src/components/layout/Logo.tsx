import React from 'react';
import styled from 'styled-components';

// GoodReads color scheme
const colors = {
  background: '#f4f1ea',
  primary: '#382110',
  secondary: '#767676'
};

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const Logo: React.FC = () => {
  return (
    <LogoContainer>
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="4" fill={colors.background} />
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle" 
          fill={colors.primary} 
          fontFamily="Georgia, serif" 
          fontWeight="bold" 
          fontSize="18"
        >
          GP
        </text>
      </svg>
    </LogoContainer>
  );
};

export default Logo; 
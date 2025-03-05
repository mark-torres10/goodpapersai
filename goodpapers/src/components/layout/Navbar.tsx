import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './Logo';

const NavContainer = styled.nav`
  background-color: #f4f1ea;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavList = styled.ul`
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-right: 2rem;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  text-decoration: none;
  color: ${props => props.$active ? '#382110' : '#767676'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  font-size: 1.1rem;
  
  &:hover {
    color: #382110;
  }
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 2rem;
  color: #382110;
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <NavContainer>
      <NavContent>
        <BrandContainer>
          <Logo />
          <Brand>GoodPapers</Brand>
        </BrandContainer>
        <NavList>
          <NavItem>
            <NavLink to="/" $active={location.pathname === '/'}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/library" $active={location.pathname === '/library'}>
              Library
            </NavLink>
          </NavItem>
        </NavList>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar; 
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Logo from './Logo';
import AddFromArxivModal from '../paper/AddFromArxivModal';

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
  justify-content: space-between;
`;

const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AddButton = styled.button`
  background-color: #382110;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #5c3d2e;
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <NavContainer>
      <NavContent>
        <NavLinksContainer>
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
        </NavLinksContainer>
        
        <AddButton onClick={() => setIsModalOpen(true)}>
          Add from ArXiv
        </AddButton>
        
        {isModalOpen && <AddFromArxivModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </NavContent>
    </NavContainer>
  );
};

export default Navbar; 
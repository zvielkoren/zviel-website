"use client"
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #17212b;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledAnchor = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Link href="/">
        <img src="/profile-picture.png" alt="Zviel Koren" style={{ height: '100px', width: '100px', borderRadius: '50%' }} />
      </Link>      <NavLinks>
        <Link href="/">
          <StyledAnchor>Home</StyledAnchor>
        </Link>
       
        <Link href="/projects">
          <StyledAnchor>Projects</StyledAnchor>
        </Link>

        <Link href="/versions">
          <StyledAnchor>Versions</StyledAnchor>
        </Link>
        
        <Link href="/contact">
          <StyledAnchor>Contact</StyledAnchor>
        </Link>
        
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;

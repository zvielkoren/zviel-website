import React from "react";
import Link from "next/link";
import styled from "styled-components";

const NavLinksContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const NavLinks: React.FC = () => {
  return (
    <NavLinksContainer>
      <StyledLink href="/">Home</StyledLink>

      <StyledLink href="/projects">Projects</StyledLink>

      <StyledLink href="/versions">Versions</StyledLink>

      <StyledLink href="/organization">Organizations</StyledLink>

      <StyledLink href="/contact">Contact</StyledLink>
    </NavLinksContainer>
  );
};

export default NavLinks;

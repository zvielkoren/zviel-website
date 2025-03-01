import React from "react";
import Link from "next/link";
import styled from "styled-components";

const NavLinksContainer = styled.div`
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

const NavLinks: React.FC = () => {
  return (
    <NavLinksContainer>
      <Link href="/">
        <StyledAnchor>Home</StyledAnchor>
      </Link>

      <Link href="/projects">
        <StyledAnchor>Projects</StyledAnchor>
      </Link>

      <Link href="/versions">
        <StyledAnchor>Versions</StyledAnchor>
      </Link>

      <Link href="/organization">
        <StyledAnchor>Organizations</StyledAnchor>
      </Link>

      <Link href="/contact">
        <StyledAnchor>Contact</StyledAnchor>
      </Link>
    </NavLinksContainer>
  );
};

export default NavLinks;

"use client";
import React from "react";
import Link from "next/link";
import styled from "styled-components";
import NavLinks from "@/components/NavLinks";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #17212b;
  color: white;
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <Link href="/">
        <img
          src="/profile-picture.png"
          alt="Zviel Koren"
          style={{ height: "100px", width: "100px", borderRadius: "50%" }}
        />
      </Link>
      <NavLinks />
    </NavbarContainer>
  );
};

export default Navbar;

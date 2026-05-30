"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Services", href: "/services" },
    { name: "Organizations", href: "/organization" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-[#080e1b]/75 backdrop-blur-md border-b border-white/5 py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Brand Area */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-white/15 p-[2px] flex-shrink-0 overflow-hidden bg-white/5 group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300">
            <img src="/profile-picture.png" alt="Zviel Koren Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity hidden sm:inline-block">
            Zviel Koren
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 relative py-1 hover:text-cyan-400 ${
                  isActive ? "text-cyan-400 font-bold" : "text-gray-300"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-gray-300 hover:text-white transition-colors focus:outline-none"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

      </div>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden w-full overflow-hidden bg-[#080e1b]/95 border-b border-white/5"
          >
            <nav className="flex flex-col gap-4 py-6 px-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-semibold py-1.5 transition-colors hover:text-cyan-400 ${
                      isActive ? "text-cyan-400" : "text-gray-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

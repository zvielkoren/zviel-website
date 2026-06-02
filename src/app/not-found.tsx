'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { FaHome } from 'react-icons/fa';

export default function NotFound() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-16 px-4 md:px-8 text-center z-10 bg-[#080e1b]">
      {/* Decorative ambient glowing grids */}
      <div className="ambient-glow-cyan top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <div className="ambient-glow-indigo bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-md w-full flex flex-col items-center"
      >
        {/* Glowing Badge */}
        <motion.div 
          variants={itemVariants} 
          className="mb-6 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono text-xs uppercase tracking-widest"
        >
          Error 404
        </motion.div>

        {/* Big 404 Header */}
        <motion.h1
          variants={itemVariants}
          className="text-8xl md:text-9xl font-black tracking-tighter mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          404
        </motion.h1>

        {/* Page Not Found Title */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-3xl font-bold text-white mb-4"
        >
          Lost in Space?
        </motion.h2>

        {/* Explanation Text */}
        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed"
        >
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable. Let's get you back on track.
        </motion.p>

        {/* Navigation Button */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-full px-6 py-3 transition-all hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-cyan-500/20 text-base"
          >
            <FaHome className="text-sm" />
            <span>Go Back Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}


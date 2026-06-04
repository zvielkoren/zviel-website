"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaTimes } from "react-icons/fa";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("announcement-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("announcement-dismissed", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full relative z-[99] bg-gradient-to-r from-cyan-950/80 via-[#0a0f1d]/90 to-indigo-950/80 border-b border-cyan-500/20 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm font-medium text-gray-200">
            <div className="flex-1 flex items-center justify-center gap-2 flex-wrap">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Available for new freelance contracts & technical consultations.</span>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all ml-1"
              >
                Let's collaborate <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
              aria-label="Dismiss Banner"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

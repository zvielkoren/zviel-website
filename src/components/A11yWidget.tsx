"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSlidersH, FaTimes, FaUndo, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { a11yStore, A11yState } from "@/utils/a11yStore";
import { Button } from "@heroui/react";

const A11yWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<A11yState>(a11yStore.getState());
  const widgetRef = useRef<HTMLDivElement>(null);

  // Subscribe to store updates
  useEffect(() => {
    // Initial sync
    const current = a11yStore.getState();
    setState(current);
    a11yStore.applyDomClasses(current);

    const unsubscribe = a11yStore.subscribe((newState) => {
      setState(newState);
    });

    return () => unsubscribe();
  }, []);

  // Handle keyboard events (escape key to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const updatePref = (updates: Partial<A11yState>) => {
    a11yStore.setState(updates);
  };

  const resetAll = () => {
    a11yStore.reset();
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 font-sans text-left" dir="ltr">
      
      {/* Floating Space-age Accessibility Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-cyan-400 via-teal-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400 relative group"
        aria-label="תפריט נגישות והתאמת תצוגה"
        aria-expanded={isOpen}
        aria-controls="a11y-preferences-menu"
      >
        <span className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10">
          <FaSlidersH size={22} className="transform group-hover:rotate-45 transition-transform duration-500" />
        </span>
      </button>

      {/* Premium Glassmorphic Preferences Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="a11y-preferences-menu"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute bottom-16 right-0 w-84 max-w-[90vw] glass-panel bg-[#090f1e]/90 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden text-white text-right"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/5">
              <div>
                <h2 className="text-md font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  התאמת תצוגה ונגישות
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5">תקן ישראלי ת״י 5568 / WCAG 2.0 AA</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="סגור תפריט נגישות"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Scrollable list of accessible categories */}
            <div className="flex flex-col gap-4.5 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* 1. Contrast (ניגודיות) */}
              <div className="flex flex-col gap-1.5 text-right">
                <span className="text-xs font-bold text-gray-300">ניגודיות צבעים</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["normal", "high", "monochrome"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updatePref({ contrast: mode })}
                      className={`text-[11px] py-1.5 px-0.5 rounded-lg border font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
                        state.contrast === mode
                          ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-950/20"
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {state.contrast === mode && <FaCheck className="text-[9px] text-cyan-300" />}
                      {mode === "normal" && "צבעי מקור"}
                      {mode === "high" && "ניגודיות גבוהה"}
                      {mode === "monochrome" && "מונוכרום"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Text Size (גודל גופן) */}
              <div className="flex flex-col gap-1.5 text-right">
                <span className="text-xs font-bold text-gray-300">גודל גופן</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["normal", "large", "extra-large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updatePref({ textSize: size })}
                      className={`text-[11px] py-1.5 px-0.5 rounded-lg border font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
                        state.textSize === size
                          ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-950/20"
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {state.textSize === size && <FaCheck className="text-[9px] text-cyan-300" />}
                      {size === "normal" && "ברירת מחדל"}
                      {size === "large" && "גדול (+15%)"}
                      {size === "extra-large" && "ענק (+30%)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Line Spacing (מרווח שורות) */}
              <div className="flex flex-col gap-1.5 text-right">
                <span className="text-xs font-bold text-gray-300">מרווח שורות וטקסט</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["normal", "wide", "extra-wide"] as const).map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => updatePref({ lineSpacing: spacing })}
                      className={`text-[11px] py-1.5 px-0.5 rounded-lg border font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
                        state.lineSpacing === spacing
                          ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-950/20"
                          : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {state.lineSpacing === spacing && <FaCheck className="text-[9px] text-cyan-300" />}
                      {spacing === "normal" && "רגיל"}
                      {spacing === "wide" && "מרווח רחב"}
                      {spacing === "extra-wide" && "מרווח ענק"}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Large Cursor (סמן עכבר מוגדל) */}
              <div className="flex justify-between items-center py-2 border-t border-white/5">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-300">סמן עכבר מוגדל</span>
                  <span className="text-[10px] text-gray-500">סמן עכבר ענק בצבע תכלת מודגש</span>
                </div>
                <button
                  onClick={() => updatePref({ cursor: state.cursor === "large" ? "normal" : "large" })}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    state.cursor === "large" ? "bg-cyan-500" : "bg-white/10"
                  }`}
                  aria-checked={state.cursor === "large"}
                  role="switch"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${
                      state.cursor === "large" ? "-translate-x-5.5" : "-translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* 5. Reduced Motion (תנועתיות מופחתת) */}
              <div className="flex justify-between items-center py-2 border-t border-white/5">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-300">נטרול אנימציות ותנועה</span>
                  <span className="text-[10px] text-gray-500">הקפאת תנועתיות למניעת סחרחורת</span>
                </div>
                <button
                  onClick={() => updatePref({ motion: state.motion === "reduced" ? "normal" : "reduced" })}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    state.motion === "reduced" ? "bg-cyan-500" : "bg-white/10"
                  }`}
                  aria-checked={state.motion === "reduced"}
                  role="switch"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${
                      state.motion === "reduced" ? "-translate-x-5.5" : "-translate-x-1"
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Footer Reset & Compliance info */}
            <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/5">
              <Button
                variant="danger-soft"
                onClick={resetAll}
                className="text-red-400 bg-red-500/10 hover:bg-red-500/20 font-bold text-[11px] py-1 px-3 h-8 flex items-center gap-1"
              >
                <FaUndo size={9} />
                איפוס הגדרות
              </Button>
              <span className="text-[9px] text-gray-500 font-mono tracking-wider">REGULATION 35 ACTIVE</span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default A11yWidget;

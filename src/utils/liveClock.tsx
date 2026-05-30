'use client';
import { useState, useEffect } from "react";

export const LiveClock = () => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <p className="text-default-600">
          © 2021 - {new Date().getFullYear()} **Zviel Koren**. All rights reserved.
        </p>
        {mounted && (
          <>
            <span className="text-default-300">|</span>
            <span>{time.toLocaleTimeString()}</span>
          </>
        )}
      </div>
    </div>
  );
};
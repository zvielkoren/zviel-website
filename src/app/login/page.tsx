"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLock, FaUser, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Dynamic ambient glowing grids */}
      <div className="ambient-glow-cyan top-1/3 left-1/4" />
      <div className="ambient-glow-indigo bottom-1/3 right-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel border border-white/5 bg-[#0c1325]/90 rounded-2xl shadow-2xl p-8 text-left relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/10 opacity-30 pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              Dashboard Login
            </h1>
            <p className="text-gray-400 text-sm">
              Authenticate to access the admin control panel.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold mb-6"
            >
              <FaExclamationTriangle className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-4 text-gray-500 text-sm pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-4 text-gray-500 text-sm pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/10 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              isDisabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-6"
            >
              {isLoading ? "Authenticating..." : "Login to Control Panel"}
            </Button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

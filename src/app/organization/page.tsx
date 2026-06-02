"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaBuilding, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button
} from "@heroui/react";

interface Organization {
  name: string;
  mission: string;
  link: string;
  logo: string;
}

const OrganizationPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isOfflineSnapshot, setIsOfflineSnapshot] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/organization");
        if (!response.ok) {
          throw new Error("GitHub organizations not found");
        }
        const data = await response.json();
        setOrganizations(data);
        const isOffline = response.headers.get("X-Offline-Snapshot") === "true";
        setIsOfflineSnapshot(isOffline);
        setError(null);
      } catch (err) {
        console.warn("GitHub API token unconfigured or rate limited.", err);
        setOrganizations([]);
        setIsOfflineSnapshot(true);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="relative min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto z-10">
      <div className="ambient-glow-cyan top-20 left-20" />
      <div className="ambient-glow-indigo bottom-20 right-20" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          My Organizations
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Collaborations, companies, and organizations that I work with or support.
        </p>

        {/* Offline Snapshot Warning Badge */}
        {isOfflineSnapshot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-300 text-xs font-semibold"
          >
            <FaExclamationTriangle className="text-[10px]" />
            <span>Local Development (Displaying cached snapshot)</span>
          </motion.div>
        )}
      </motion.div>

      {organizations.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl glass-panel relative z-10">
          <p className="text-gray-400 text-lg">No organizations connected at the moment.</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {organizations.map((org, index) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => setSelectedOrganization(org)}
                className="glass-panel border-white/5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 w-full h-[280px] flex flex-col justify-between text-left group"
              >
                <CardHeader className="flex gap-4 p-6 items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-500/40 p-[2px] flex-shrink-0 overflow-hidden bg-white/5 flex items-center justify-center relative">
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={`${org.name} logo`}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          const sibling = (e.currentTarget as HTMLImageElement).nextElementSibling;
                          if (sibling) {
                            (sibling as HTMLElement).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex items-center justify-center text-indigo-400"
                      style={{ display: org.logo ? "none" : "flex" }}
                    >
                      <FaBuilding size={20} />
                    </div>
                  </div>
                  <div className="flex flex-col text-left">
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {org.name}
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">GitHub Org</span>
                  </div>
                </CardHeader>

                <CardContent className="px-6 py-0 flex-grow">
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {org.mission || "No mission statement or description provided."}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center p-6 border-t border-white/5">
                  <span className="text-xs text-cyan-400 flex items-center gap-1 font-semibold">
                    <FaBuilding /> Learn More
                  </span>
                  <Link
                    href={`https://github.com/${org.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                  >
                    <FaGithub size={18} />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Custom Framer Motion Modal Overlay */}
      <AnimatePresence>
        {selectedOrganization && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrganization(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel border-white/10 text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl bg-[#0c1325]/95 relative"
            >
              <button
                onClick={() => setSelectedOrganization(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
                aria-label="Close"
              >
                <FaTimes size={16} />
              </button>

              <div className="flex gap-4 p-6 items-center border-b border-white/5">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/40 p-[2px] flex-shrink-0 overflow-hidden bg-white/5 flex items-center justify-center relative">
                  {selectedOrganization.logo ? (
                    <img
                      src={selectedOrganization.logo}
                      alt={selectedOrganization.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        const sibling = (e.currentTarget as HTMLImageElement).nextElementSibling;
                        if (sibling) {
                          (sibling as HTMLElement).style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center text-indigo-400"
                    style={{ display: selectedOrganization.logo ? "none" : "flex" }}
                  >
                    <FaBuilding size={20} />
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    {selectedOrganization.name}
                  </h2>
                  <span className="text-xs text-gray-500 font-mono">Organization Profile</span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-300 text-sm leading-relaxed text-left">
                  {selectedOrganization.mission || "No description provided."}
                </p>
              </div>

              <div className="p-6 border-t border-white/5 flex justify-between">
                <Link
                  href={`https://github.com/${selectedOrganization.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-xl px-4 py-2 transition-all hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-cyan-500/20 text-sm"
                >
                  <FaGithub />
                  <span>View Organization</span>
                </Link>
                <Button
                  variant="danger-soft"
                  className="text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  onClick={() => setSelectedOrganization(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizationPage;

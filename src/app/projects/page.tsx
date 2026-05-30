"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaGithub, FaStar, FaCalendar, FaCode, FaSearch, FaTimes, FaWifi, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Chip,
  Button,
  Input
} from "@heroui/react";

interface Project {
  id: string;
  name: string;
  description: string;
  githubLink: string;
  owner: string;
  ownerName: string;
  stars: number;
  language: string;
  updatedAt: string;
  private: boolean;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fallback-1",
    name: "zviel-website",
    description: "Personal portfolio and developer platform built with Next.js, HeroUI, Tailwind CSS v4, and dynamic Cloudflare Edge workers API integration.",
    githubLink: "https://github.com/zvielkoren/zviel-website",
    owner: "132788625",
    ownerName: "zvielkoren",
    stars: 8,
    language: "TypeScript",
    updatedAt: new Date().toISOString(),
    private: false
  },
  {
    id: "fallback-2",
    name: "rusty-compiler",
    description: "An experimental ahead-of-time micro-compiler engineered in Rust, compiling a custom subset of typed syntax directly into optimized x86 assembly.",
    githubLink: "https://github.com/zvielkoren/rusty-compiler",
    owner: "132788625",
    ownerName: "zvielkoren",
    stars: 14,
    language: "Rust",
    updatedAt: new Date().toISOString(),
    private: false
  },
  {
    id: "fallback-3",
    name: "ai-agent-sdk",
    description: "An autonomous agent orchestration SDK for running stateful, tool-enabled AI workflows locally with strict JSON schema outputs and visual debugger UI.",
    githubLink: "https://github.com/zvielkoren/ai-agent-sdk",
    owner: "132788625",
    ownerName: "zvielkoren",
    stars: 22,
    language: "Python",
    updatedAt: new Date().toISOString(),
    private: false
  }
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [isOfflineSnapshot, setIsOfflineSnapshot] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || "Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
      const isOffline = response.headers.get("X-Offline-Snapshot") === "true";
      setIsOfflineSnapshot(isOffline);
      setError(null);
    } catch (error) {
      console.warn("GitHub API token unconfigured or rate limited. Loading cached local snapshots instead.", error);
      setProjects(FALLBACK_PROJECTS);
      setIsOfflineSnapshot(true);
      setError(null); // Clear error to allow rendering the fallback UI gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 60000);
    return () => clearInterval(interval);
  }, []);

  // Compute unique languages dynamically
  const languages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach((p) => {
      if (p.language) langs.add(p.language);
    });
    return ["All", ...Array.from(langs)];
  }, [projects]);

  // Filter projects by search query and selected language
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = selectedLanguage === "All" || p.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });
  }, [projects, searchQuery, selectedLanguage]);

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="relative min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto z-10">
      <div className="ambient-glow-cyan top-10 right-10" />
      <div className="ambient-glow-indigo bottom-10 left-10" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          My Projects
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          A showcase of recent open-source software, active tools, and coding experiments.
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

      {/* Search & Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between relative z-10"
      >
        <div className="relative max-w-md w-full glass-panel rounded-xl bg-white/5 border border-white/5 group focus-within:border-cyan-400/50 flex items-center px-3.5 py-2">
          <FaSearch className="text-gray-400 text-sm flex-shrink-0 mr-1" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none ml-2"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer ml-1 p-0.5 hover:bg-white/10 rounded-full"
              aria-label="Clear search"
            >
              <FaTimes className="text-[10px]" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          {languages.map((lang) => (
            <Button
              key={lang}
              variant={selectedLanguage === lang ? "primary" : "ghost"}
              className={`${
                selectedLanguage === lang
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold"
                  : "bg-white/5 text-gray-300 border border-white/5 hover:border-white/10"
              } text-xs py-1.5 px-4 rounded-full transition-all`}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Grid List */}
      <AnimatePresence mode="popLayout">
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-white/5 rounded-2xl glass-panel relative z-10"
          >
            <p className="text-gray-400 text-lg">No projects match your current filters.</p>
            <Button
              variant="secondary"
              className="mt-4 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20"
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage("All");
              }}
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  onClick={() => openProjectModal(project)}
                  className="glass-panel border-white/5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 w-full h-[260px] flex flex-col justify-between text-left group"
                >
                  <CardHeader className="flex flex-col items-start gap-1 p-6">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs text-cyan-400 uppercase tracking-widest font-semibold font-mono">
                        {project.ownerName}
                      </span>
                      {project.stars > 0 && (
                        <div className="flex items-center text-yellow-500 gap-1 text-sm bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                          <FaStar className="text-xs" />
                          <span className="font-semibold">{project.stars}</span>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mt-2">
                      {project.name}
                    </h2>
                  </CardHeader>

                  <CardContent className="px-6 py-0 flex-grow">
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {project.description || "No description provided."}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center p-6 border-t border-white/5">
                    {project.language ? (
                      <Chip
                        size="sm"
                        variant="soft"
                        color="accent"
                        className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold"
                      >
                        {project.language}
                      </Chip>
                    ) : (
                      <span />
                    )}

                    <Link
                      href={project.githubLink}
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
      </AnimatePresence>

      {/* Details Custom Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel border-white/10 text-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl bg-[#0c1325]/95 relative"
            >
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full animate-fade-in"
                aria-label="Close"
              >
                <FaTimes size={16} />
              </button>

              <div className="p-6 border-b border-white/5 text-left">
                <div className="flex gap-2 items-center">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    {selectedProject.name}
                  </h2>
                  <Chip
                    size="sm"
                    variant="soft"
                    className={`${
                      selectedProject.private
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}
                  >
                    {selectedProject.private ? "Private" : "Public"}
                  </Chip>
                </div>
                <span className="text-xs text-gray-500 font-mono mt-1 block">By: {selectedProject.ownerName}</span>
              </div>

              <div className="p-6 flex flex-col gap-5 text-left">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedProject.description || "No description provided."}
                </p>

                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm">
                      <FaCode />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-gray-500">Language</span>
                      <span className="text-sm font-semibold text-white">
                        {selectedProject.language || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm">
                      <FaStar />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-gray-500">Stars</span>
                      <span className="text-sm font-semibold text-white">
                        {selectedProject.stars}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 col-span-2">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-sm">
                      <FaCalendar />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs text-gray-500">Last Sync / Update</span>
                      <span className="text-sm font-semibold text-white">
                        {new Date(selectedProject.updatedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex justify-between">
                <Link
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 justify-center font-semibold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-xl px-4 py-2 transition-all hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-cyan-500/20 text-sm"
                >
                  <FaGithub />
                  <span>View on GitHub</span>
                </Link>
                <Button
                  variant="danger-soft"
                  className="text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  onClick={closeProjectModal}
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

export default ProjectsPage;
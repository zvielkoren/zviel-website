"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaBuilding,
  FaServer,
  FaPlus,
  FaTrash,
  FaGithub,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLink,
  FaStar
} from "react-icons/fa";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@heroui/react";

interface DemoFile {
  name: string;
  path: string;
}

interface Demo {
  id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  fileType?: string;
  filePath?: string;
  features: string[];
  files: DemoFile[];
}

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

interface Organization {
  name: string;
  mission: string;
  link: string;
  logo: string;
}

type TabType = "demos" | "projects" | "organizations";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Demos State
  const [demos, setDemos] = useState<Demo[]>([]);
  const [demoFormData, setDemoFormData] = useState({
    title: "",
    description: "",
    url: "",
    imageUrl: "",
    files: [] as { file: File; path: string }[],
    features: [] as string[]
  });
  const [newFeature, setNewFeature] = useState("");

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: "",
    githubLink: "",
    ownerName: "",
    stars: 0,
    language: "TypeScript",
    private: false
  });

  // Organizations State
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgFormData, setOrgFormData] = useState({
    name: "",
    mission: "",
    link: "",
    logo: ""
  });

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [demosRes, projectsRes, orgsRes] = await Promise.all([
        fetch("/api/demos").catch(() => null),
        fetch("/api/projects").catch(() => null),
        fetch("/api/organization").catch(() => null)
      ]);

      if (demosRes && demosRes.ok) {
        const data = await demosRes.json();
        setDemos(data.demos || []);
      }
      if (projectsRes && projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data || []);
      }
      if (orgsRes && orgsRes.ok) {
        const data = await orgsRes.json();
        setOrganizations(data || []);
      }

      setStatusMessage(null);
    } catch (e) {
      console.error("Dashboard failed to load data:", e);
      setStatusMessage({ text: "Failed to load dashboard data", isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerNotification = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // --- CRUD: PROJECTS ---
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectFormData,
          id: `manual-${Date.now()}`,
          owner: "manual"
        })
      });

      if (!response.ok) throw new Error("Failed to add project");
      
      triggerNotification("Project added successfully!");
      setProjectFormData({
        name: "",
        description: "",
        githubLink: "",
        ownerName: "zvielkoren",
        stars: 0,
        language: "TypeScript",
        private: false
      });
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message || "Failed to add project", true);
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete project");
      
      triggerNotification("Project deleted successfully.");
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message || "Failed to delete project", true);
    }
  };

  // --- CRUD: ORGANIZATIONS ---
  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgFormData)
      });

      if (!response.ok) throw new Error("Failed to add organization");
      
      triggerNotification("Organization added successfully!");
      setOrgFormData({
        name: "",
        mission: "",
        link: "",
        logo: ""
      });
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message || "Failed to add organization", true);
    }
  };

  const handleOrgDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete organization "${name}"?`)) return;
    try {
      const response = await fetch(`/api/organization?name=${encodeURIComponent(name)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete organization");
      
      triggerNotification("Organization deleted successfully.");
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message || "Failed to delete organization", true);
    }
  };

  // --- CRUD: DEMOS (Original functionality) ---
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", demoFormData.title);
      formDataToSend.append("description", demoFormData.description);
      formDataToSend.append("url", demoFormData.url);
      formDataToSend.append("imageUrl", demoFormData.imageUrl);
      
      demoFormData.features.forEach(feature => {
        formDataToSend.append("features[]", feature);
      });

      demoFormData.files.forEach(({ file }) => {
        formDataToSend.append("files[]", file);
      });

      const response = await fetch("/api/demos", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to create demo");

      triggerNotification("Demo added successfully!");
      setDemoFormData({
        title: "",
        description: "",
        url: "",
        imageUrl: "",
        files: [],
        features: []
      });
      setNewFeature("");
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message || "Failed to create demo", true);
    }
  };

  const handleDemoDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demo?")) return;
    try {
      const response = await fetch(`/api/demos?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete demo");
      
      triggerNotification("Demo deleted successfully.");
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message || "Failed to delete demo", true);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="relative min-h-screen py-16 px-4 md:px-8 max-w-7xl mx-auto z-10">
      {/* Background ambient glows */}
      <div className="ambient-glow-cyan top-10 right-10" />
      <div className="ambient-glow-indigo bottom-10 left-10" />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Manage your portfolio data, add manual projects/organizations, or upload mock code demos.
        </p>
      </div>

      {/* Status Notifications */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full border shadow-xl ${
              statusMessage.isError
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-green-500/10 border-green-500/20 text-green-400"
            }`}
          >
            {statusMessage.isError ? <FaExclamationTriangle /> : <FaCheckCircle />}
            <span className="text-sm font-semibold">{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 glass-panel border border-white/5 rounded-2xl max-w-lg mx-auto mb-12 relative z-10 bg-white/5">
        {(["projects", "organizations", "demos"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-black capitalize transition-all duration-300 flex items-center justify-center gap-2 relative ${
              activeTab === tab
                ? "text-cyan-400 bg-[#0c1325]/80 border border-white/5 shadow-md shadow-cyan-950/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "projects" && <FaCode size={14} />}
            {tab === "organizations" && <FaBuilding size={14} />}
            {tab === "demos" && <FaServer size={14} />}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* Main Panel Content */}
      <div className="relative z-10 w-full">
        {/* --- TAB 1: MANAGE PROJECTS --- */}
        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form Column */}
            <div className="lg:col-span-1 glass-panel border border-white/5 rounded-2xl p-6 bg-white/5 text-left h-fit">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaPlus className="text-cyan-400 text-sm" /> Add Project Manually
              </h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. custom-compiler"
                    value={projectFormData.name}
                    onChange={(e) => setProjectFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your technical build..."
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/zvielkoren/..."
                    value={projectFormData.githubLink}
                    onChange={(e) => setProjectFormData(p => ({ ...p, githubLink: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Owner Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="zvielkoren"
                    value={projectFormData.ownerName}
                    onChange={(e) => setProjectFormData(p => ({ ...p, ownerName: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Stars Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={projectFormData.stars}
                      onChange={(e) => setProjectFormData(p => ({ ...p, stars: Number(e.target.value) }))}
                      className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Language
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rust, TypeScript"
                      value={projectFormData.language}
                      onChange={(e) => setProjectFormData(p => ({ ...p, language: e.target.value }))}
                      className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={projectFormData.private}
                    onChange={(e) => setProjectFormData(p => ({ ...p, private: e.target.checked }))}
                    className="w-4 h-4 rounded accent-cyan-400 bg-[#080e1b]/60 border border-white/10"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-semibold text-gray-300 cursor-pointer">
                    Private Repository
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 mt-4"
                >
                  Save Project Record
                </Button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2 glass-panel border border-white/5 rounded-2xl p-6 bg-white/5 text-left flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Active Portfolio Projects ({projects.length})</h2>
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-sm py-12 text-center">No projects loaded. Add one on the left to start!</p>
                ) : (
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex items-center justify-between p-4 bg-[#080e1b]/60 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 group"
                      >
                        <div className="flex flex-col gap-1 pr-4">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {proj.name}
                            </h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              proj.private ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
                            }`}>
                              {proj.private ? "Private" : "Public"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2 max-w-lg leading-relaxed">
                            {proj.description}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono mt-1">
                            <span className="flex items-center gap-1"><FaCode /> {proj.language}</span>
                            <span className="flex items-center gap-1"><FaStar className="text-yellow-500" /> {proj.stars}</span>
                            <span className="text-cyan-400">By: {proj.ownerName}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleProjectDelete(proj.id)}
                          className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 flex-shrink-0 cursor-pointer"
                          aria-label="Delete Project"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB 2: MANAGE ORGANIZATIONS --- */}
        {activeTab === "organizations" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form Column */}
            <div className="lg:col-span-1 glass-panel border border-white/5 rounded-2xl p-6 bg-white/5 text-left h-fit">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaPlus className="text-indigo-400 text-sm" /> Add Org Manually
              </h2>
              <form onSubmit={handleOrgSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CloudForge"
                    value={orgFormData.name}
                    onChange={(e) => setOrgFormData(o => ({ ...o, name: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Mission / Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="A collaborative lab specializing in serverless edge structures..."
                    value={orgFormData.mission}
                    onChange={(e) => setOrgFormData(o => ({ ...o, mission: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Website/GitHub Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/orgs/..."
                    value={orgFormData.link}
                    onChange={(e) => setOrgFormData(o => ({ ...o, link: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://avatars.githubusercontent.com/..."
                    value={orgFormData.logo}
                    onChange={(e) => setOrgFormData(o => ({ ...o, logo: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-400/50"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 mt-4"
                >
                  Save Organization Record
                </Button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2 glass-panel border border-white/5 rounded-2xl p-6 bg-white/5 text-left flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Connected Organizations ({organizations.length})</h2>
                {organizations.length === 0 ? (
                  <p className="text-gray-500 text-sm py-12 text-center">No organizations loaded. Add one on the left to start!</p>
                ) : (
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                    {organizations.map((org) => (
                      <div
                        key={org.name}
                        className="flex items-center justify-between p-4 bg-[#080e1b]/60 border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4 pr-4">
                          <div className="w-10 h-10 rounded-full border border-indigo-500/30 p-[2px] overflow-hidden bg-white/5 flex-shrink-0">
                            <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {org.name}
                            </h3>
                            <p className="text-xs text-gray-400 line-clamp-2 max-w-md leading-relaxed">
                              {org.mission}
                            </p>
                            <a
                              href={org.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-1 hover:underline w-fit"
                            >
                              <FaLink size={8} /> {org.link}
                            </a>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOrgDelete(org.name)}
                          className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 flex-shrink-0 cursor-pointer"
                          aria-label="Delete Organization"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB 3: MANAGE DEMOS (Original) --- */}
        {activeTab === "demos" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form Column */}
            <div className="lg:col-span-1 glass-panel border border-white/5 rounded-2xl p-6 bg-white/5 text-left h-fit">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaPlus className="text-purple-400 text-sm" /> Add Code Demo
              </h2>
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Demo Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Markdown Parser"
                    value={demoFormData.title}
                    onChange={(e) => setDemoFormData(d => ({ ...d, title: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what the code demo validates..."
                    value={demoFormData.description}
                    onChange={(e) => setDemoFormData(d => ({ ...d, description: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={demoFormData.url}
                    onChange={(e) => setDemoFormData(d => ({ ...d, url: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Display Image URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={demoFormData.imageUrl}
                    onChange={(e) => setDemoFormData(d => ({ ...d, imageUrl: e.target.value }))}
                    className="w-full bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400/50"
                  />
                </div>

                {/* Features input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Features
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a key feature tag"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 bg-[#080e1b]/60 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-400/50"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newFeature.trim()) {
                          setDemoFormData(d => ({ ...d, features: [...d.features, newFeature.trim()] }));
                          setNewFeature("");
                        }
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-3 rounded-xl font-bold"
                    >
                      Add
                    </Button>
                  </div>
                  {demoFormData.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {demoFormData.features.map((feat, idx) => (
                        <span key={idx} className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          {feat}
                          <button
                            type="button"
                            onClick={() => setDemoFormData(d => ({ ...d, features: d.features.filter((_, i) => i !== idx) }))}
                            className="hover:text-red-400 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-purple-500/25 mt-4"
                >
                  Save Code Demo
                </Button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2 glass-panel border border-white/5 rounded-2xl p-6 bg-white/5 text-left flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Manage Demos ({demos.length})</h2>
                {demos.length === 0 ? (
                  <p className="text-gray-500 text-sm py-12 text-center">No uploaded code demos yet.</p>
                ) : (
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                    {demos.map((demo) => (
                      <div
                        key={demo.id}
                        className="flex items-center justify-between p-4 bg-[#080e1b]/60 border border-white/5 rounded-xl hover:border-purple-500/30 transition-all duration-300 group"
                      >
                        <div className="flex flex-col gap-0.5">
                          <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                            {demo.title}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 max-w-md leading-relaxed">
                            {demo.description}
                          </p>
                          {demo.features && demo.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {demo.features.map((feat, idx) => (
                                <span key={idx} className="bg-white/5 text-gray-400 text-[9px] px-1.5 py-0.5 rounded border border-white/5">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDemoDelete(demo.id)}
                          className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 flex-shrink-0 cursor-pointer"
                          aria-label="Delete Demo"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

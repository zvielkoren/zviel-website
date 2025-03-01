'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaStar, FaTimes, FaCalendar, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

interface Project {
  id: string;
  name: string;
  description: string;
  githubLink: string;
  owner: string;
  stars: number;
  language: string;
  updatedAt: string;
  private: boolean;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 60000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-cyan-200 text-center"
      >
        My Projects
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openProjectModal(project)}
            className="bg-gradient-to-br from-[#6e89a8] to-[#7a97b8] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{project.name}</h2>
            <p className="text-gray-600 mb-4 h-20 overflow-y-auto">
              {project.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4 mb-4">
              {project.language && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {project.language}
                </span>
              )}
              <div className="flex items-center text-yellow-600">
                <FaStar className="mr-1" />
                <span>{project.stars}</span>
              </div>
            </div>
            <Link
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-300"
            >
              <FaGithub className="mr-2" />
              View on GitHub
            </Link>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 max-w-md w-full relative"
            >
              <button 
                onClick={closeProjectModal} 
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <FaTimes size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
              <p className="text-gray-700 mb-4">{selectedProject.description}</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaCode className="mr-2 text-blue-600" />
                  <span>Language: {selectedProject.language || 'Not specified'}</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="mr-2 text-yellow-600" />
                  <span>Stars: {selectedProject.stars}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-green-600" />
                  <span>Last Updated: {new Date(selectedProject.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-red-600">{selectedProject.private ? 'Private' : 'Public'}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Link
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  View on GitHub
                </Link>
                <button 
                  onClick={closeProjectModal}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;
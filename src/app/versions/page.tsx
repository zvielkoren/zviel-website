'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaRocket, FaCalendar, FaTag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface WebsiteVersion {
  id: number;
  version: string;
  date: string;
  description: string;
  changes: string[];
  deploymentLink?: string;
}

const VersionsPage = () => {
  const [versions, setVersions] = useState<WebsiteVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<WebsiteVersion | null>(null);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/versions', { 
        cache: 'no-store',  // Disable caching
        next: { revalidate: 0 }  // Force dynamic rendering
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details?.message || 'Failed to fetch versions');
      }
      
      const data = await response.json();
      setVersions(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const openVersionModal = (version: WebsiteVersion) => {
    setSelectedVersion(version);
  };

  const closeVersionModal = () => {
    setSelectedVersion(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={fetchVersions} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-cyan-200 text-center"
      >
        Website Versions
      </motion.h1>
      {versions.length === 0 ? (
        <div className="text-center text-gray-500">
          No versions found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => openVersionModal(version)}
              className="bg-gradient-to-br from-[#6e89a8] to-[#7a97b8] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{version.version}</h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {version.version}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <FaCalendar className="mr-2" />
                <span>{new Date(version.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 line-clamp-3">
                {version.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedVersion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={closeVersionModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto"
            >
              <button 
                onClick={closeVersionModal} 
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <FaTag size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Version {selectedVersion.version}</h2>
              <div className="space-y-4">
                <div>
                  <strong>Description:</strong>
                  <p>{selectedVersion.description}</p>
                </div>
                <div>
                  <strong>Release Date:</strong>
                  <p>{new Date(selectedVersion.date).toLocaleString()}</p>
                </div>
                <div>
                  <strong>Key Changes:</strong>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedVersion.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
                {selectedVersion.deploymentLink && (
                  <div>
                    <Link 
                      href={selectedVersion.deploymentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FaRocket className="mr-2" />
                      View Deployed Version
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VersionsPage;

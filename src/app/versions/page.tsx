'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCalendar, FaTag, FaCloud, FaCode, FaBug, FaGraduationCap, FaGit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface VersionNative {
  title: string;
  description: string;
  technicalDetails: string[];
  challenges: string[];
  learnings: string[];
  imageUrl?: string;
}

interface WebsiteVersion {
  version: string;
  deploymentDate: string;
  commitHash: string;
  changelog: Array<{
    type: 'feat' | 'fix' | 'docs' | 'chore';
    description: string;
    date: string;
  }>;
  deploymentPlatform: 'Cloudflare Workers';
  links: {
    website: string;
    repository?: string;
  };
  native?: VersionNative;
  originalCommits?: {
    hash: string;
    message: string;
    date: string;
    author: string;
  }[];
}

const DEFAULT_VERSION: WebsiteVersion = {
  version: '0.0.1',
  deploymentDate: new Date().toISOString(),
  commitHash: 'unknown',
  changelog: [],
  deploymentPlatform: 'Cloudflare Workers',
  links: {
    website: 'https://zvielkoren.com'
  }
};

const VersionsPage = () => {
  const [versions, setVersions] = useState<WebsiteVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<WebsiteVersion | null>(null);
  const [testFilters, setTestFilters] = useState({
    website: 'https://zvielkoren.com',
    version: '1.0.0',
    platform: 'Cloudflare Workers'
  });
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    filters?: object;
  }>({ message: '' });

  const fetchVersions = async (event: React.MouseEvent<HTMLButtonElement>, filters?: { 
    website?: string, 
    version?: string, 
    platform?: string 
  }) => {
    try {
      setError('');
      setErrorDetails({});
      setLoading(true);

      const queryParams = new URLSearchParams();
      if (filters?.website) queryParams.set('website', filters.website);
      if (filters?.version) queryParams.set('version', filters.version);
      if (filters?.platform) queryParams.set('platform', filters.platform);

      const response = await fetch(`/api/versions?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch versions');
      }

      const data: WebsiteVersion[] = await response.json();
      setVersions(data);
    } catch (err: any) {
      console.error('Fetch versions error:', err);
      setError(err.message || 'An unexpected error occurred');
      setErrorDetails({
        message: err.message,
        filters: filters
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions(null);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-cyan-200 text-center"
      >
        Website Version History
      </motion.h1>
      
      {error && (
        <div className="text-red-500 text-center mb-4">
          <p>{error}</p>
          <button 
            onClick={(event) => fetchVersions(event)} 
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {errorDetails.message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorDetails.message}</span>
          {errorDetails.filters && (
            <pre className="mt-2 text-sm">
              Filters: {JSON.stringify(errorDetails.filters, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="mb-4 flex space-x-2 justify-center">
        <button 
          onClick={(event) => fetchVersions(event, { website: testFilters.website })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Website Filter
        </button>
        <button 
          onClick={(event) => fetchVersions(event, { version: testFilters.version })}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Version Filter
        </button>
        <button 
          onClick={(event) => fetchVersions(event, { platform: testFilters.platform })}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Test Platform Filter
        </button>
        <button 
          onClick={(event) => fetchVersions(event)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Fetch All Versions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {versions.map((version, index) => (
          <motion.div
            key={version.commitHash}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openVersionModal(version)}
            className="bg-gradient-to-br from-[#6e89a8] to-[#7a97b8] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {version.version}
              </h2>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                <FaCloud className="mr-2" /> {version.deploymentPlatform}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <FaCalendar className="mr-2" />
              <span>
                {new Date(version.deploymentDate).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 line-clamp-3">
              Commit: {version.commitHash.substring(0, 7)}
            </p>
            {version.native && (
              <div className="mt-4 text-sm text-gray-700">
                <strong>{version.native.title}</strong>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVersion && selectedVersion.native && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeVersionModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto grid md:grid-cols-2 gap-6"
            >
              <div>
                <button 
                  onClick={closeVersionModal} 
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                  <FaTag size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  Version {selectedVersion.version}
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    <FaCloud className="inline mr-2" /> 
                    {selectedVersion.deploymentPlatform}
                  </span>
                </h2>
                
                {selectedVersion.native?.imageUrl && (
                  <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                    <Image 
                      src={selectedVersion.native.imageUrl} 
                      alt={`Version ${selectedVersion.version} Screenshot`}
                      width={600}
                      height={400}
                      className="w-full object-cover"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold flex items-center mb-2">
                      <FaTag className="mr-2" /> Description
                    </h3>
                    <p>{selectedVersion.native.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold flex items-center mb-2">
                    <FaCode className="mr-2" /> Technical Details
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedVersion.native.technicalDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold flex items-center mb-2">
                    <FaBug className="mr-2" /> Challenges
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedVersion.native.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold flex items-center mb-2">
                    <FaGraduationCap className="mr-2" /> Learnings
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedVersion.native.learnings.map((learning, index) => (
                      <li key={index}>{learning}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedVersion.originalCommits && (
                  <div>
                    <h3 className="font-bold flex items-center mb-2">
                      <FaGit className="mr-2" /> Original Commits
                    </h3>
                    <ul className="space-y-2">
                      {selectedVersion.originalCommits.map((commit, index) => (
                        <li 
                          key={commit.hash} 
                          className="bg-gray-100 p-2 rounded"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-sm text-gray-600">
                              {commit.hash.substring(0, 7)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(commit.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{commit.message}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            By {commit.author}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Links</h3>
                  <div className="flex space-x-4">
                    <a 
                      href={selectedVersion.links.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                    {selectedVersion.links.repository && (
                      <a 
                        href={selectedVersion.links.repository} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Repository
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VersionsPage;

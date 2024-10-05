  'use client'
  import React, { useState, useEffect } from 'react';
  import Link from 'next/link';
  import { FaGithub } from 'react-icons/fa';
  import { Octokit } from '@octokit/rest';

  const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      try {
        const users = ['zvielkoren', 'zvicraft'];
        const fetchedProjects: Array<{
          name: string;
          description: string;
          githubLink: string;
          owner: string;
        }> = [];

        for (const username of users) {
          const response = await octokit.repos.listForUser({
            username,
            sort: 'updated',
            direction: 'desc',
            per_page: 1000,
          });

          const userProjects = response.data.map(repo => ({
            name: repo.name,
            description: repo.description || '',
            githubLink: repo.html_url,
            owner: username,
          }));

          fetchedProjects.push(...userProjects);
        }

        
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    useEffect(() => {
      fetchProjects();
      const interval = setInterval(fetchProjects, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-cyan-200">My Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="bg-[#8aa4c1] shadow-md rounded-lg p-6 drop-shadow-2xl">
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <p className="text-gray-600 mb-4">{project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}</p>
              <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                <FaGithub className="mr-2" />
                View on GitHub
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default ProjectsPage;
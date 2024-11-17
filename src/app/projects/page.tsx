'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { Octokit } from '@octokit/rest';

interface Project {
  id: string;
  name: string;
  description: string;
  githubLink: string;
  owner: string;
}


const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  const fetchProjects = async () => {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    try {
      const userIds = ['132788625', '181019388'];
      const fetchedProjects: Project[] = [];

      for (const id of userIds) {
        const response = await octokit.rest.repos.listForAuthenticatedUser({
          sort: 'updated',
          direction: 'desc',
          per_page: 1000,
        });

        const userProjects = response.data.map(repo => ({
          id: repo.id.toString(),
          name: repo.name,
          description: repo.description || '',
          githubLink: repo.html_url,
          owner: id,
        }));

        fetchedProjects.push(...userProjects);
      }

      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {    const interval = setInterval(fetchProjects, Number(process.env.TimeOuteFetch) || 60000);
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

function fetchProjects(): void {
  throw new Error('Function not implemented.');
}

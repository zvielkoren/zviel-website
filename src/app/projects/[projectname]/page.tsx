'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaGithub, FaStar, FaCalendar, FaCode, FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import Loading from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { motion, AnimatePresence } from 'framer-motion';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { ComponentProps } from 'react';
 export const runtime = 'edge';
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

const slugify = (name: string) => name.replace(/\s+/g, '-');

export default function ProjectModalPage() {
  const params = useParams();
  const router = useRouter();
  const projectSlug = params?.projectname;

  const [project, setProject] = useState<Project | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!projectSlug) return;

    const fetchProject = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data: Project[] = await res.json();

        const proj = data.find((p) => slugify(p.name) === projectSlug);
        if (!proj) throw new Error('Project not found');

        setProject(proj);
        setError(null);

        const readmeRes = await fetch(`/api/projects/${proj.ownerName}/${proj.name}`);
        if (!readmeRes.ok) throw new Error('Failed to fetch README');
        const readmeData = await readmeRes.json();
        setReadme(readmeData.readme || 'No README available');
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectSlug]);

  if (!isOpen) {
    router.push('/projects');
    return null;
  }

  if (loading) return <Loading />;
  if (error || !project) return <ErrorMessage message={error || 'Project not found'} />;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-lg p-8 max-w-4xl w-full overflow-y-auto max-h-[90vh] relative"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <FaTimes size={24} />
          </button>

          <h1 className="text-3xl font-bold mb-4 text-white">
            {project.name} | By: {project.ownerName}
          </h1>
          <p className="text-gray-300 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-6 mb-6 text-gray-200">
            <div className="flex items-center gap-2">
              <FaCode className="text-blue-400" /> <span>{project.language || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" /> <span>{project.stars}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="text-green-400" />{' '}
              <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="text-red-400">{project.private ? 'Private' : 'Public'}</div>
          </div>

          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors mb-6"
          >
            <FaGithub className="inline mr-2" /> View on GitHub
          </a>

          {/* README Markdown */}
          <div className="max-w-none bg-blue-800/70 text-blue-100 p-6 rounded-md overflow-x-auto">
            <ReactMarkdown
              children={readme || 'No README available.'}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code({
                  inline,
                  className,
                  children,
                  ...props
                }: ComponentProps<'code'> & { inline?: boolean }) {
                  return (
                    <code
                      className={`bg-blue-700 text-blue-100 px-2 py-1 rounded text-sm ${
                        inline ? 'inline' : 'block my-2'
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre({ className, children, ...props }) {
                  return (
                    <pre
                      className="bg-blue-700 text-blue-100 p-4 rounded-md overflow-x-auto my-4"
                      {...props}
                    >
                      {children}
                    </pre>
                  );
                },
                a({ href, children, ...props }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-200 hover:underline"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

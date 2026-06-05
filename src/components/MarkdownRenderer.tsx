'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { ComponentProps } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      children={content}
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
  );
}

'use client';

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { useState, useEffect } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState('');
  
  useEffect(() => {
    const renderMarkdown = async () => {
      const parsed = await marked.parse(content);
      setHtml(DOMPurify.sanitize(parsed));
    };
    renderMarkdown();
  }, [content]);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

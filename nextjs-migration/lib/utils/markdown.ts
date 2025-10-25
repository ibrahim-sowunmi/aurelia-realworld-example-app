import { Marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Convert markdown text to HTML
 * React equivalent of Aurelia's markdownHtml value converter
 */
export function markdownToHtml(text: string): string {
  if (!text) return '';
  const marked = new Marked();
  return DOMPurify.sanitize(marked.parse(text, { async: false }) as string);
}

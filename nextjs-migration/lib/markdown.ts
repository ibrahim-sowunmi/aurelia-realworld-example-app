import { marked } from 'marked';

export function markdownToHtml(text: string): string {
  try {
    if (!text) return '';
    return marked.parse(text) as string;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return text;
  }
}

/**
 * Format text by replacing newlines with <br> tags
 * React equivalent of Aurelia's formatHtml value converter
 */
export function formatHtml(text: string): string {
  if (!text) return '';
  return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

import { format, parseISO } from 'date-fns';

/**
 * Format a date string to 'Month Day, Year'
 * React equivalent of Aurelia's date value converter
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return format(date, 'MMMM d, yyyy');
}

/**
 * Get all keys from an object
 * React equivalent of Aurelia's keys value converter
 */
export function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
  if (!obj) return [];
  return Object.keys(obj) as (keyof T)[];
}

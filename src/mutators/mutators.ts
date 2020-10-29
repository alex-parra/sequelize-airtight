import type { Mutator } from '../airtight';

/**
 * Trim white-space from both ends of string
 */
export const trim: Mutator<boolean> = ({ value, options }) => {
  if (options !== true) return value;
  if (typeof value !== 'string') return value;
  return value.trim();
};

/**
 * Convert to lowercase respecting locale
 */
export const lower: Mutator<boolean> = ({ value, options }) => {
  if (options !== true) return value;
  if (typeof value !== 'string') return value;
  return value.toLowerCase();
};

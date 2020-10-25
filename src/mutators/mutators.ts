import type { Mutator } from '../airtight';

/**
 * Trim white-space from both ends of string
 */
export const trim: Mutator<boolean | string> = ({ value, options }) => {
  if (options !== true) return value;
  if (typeof value !== 'string') return value;
  return value.trim();
};

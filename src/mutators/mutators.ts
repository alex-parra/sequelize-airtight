import type { Mutator } from '../airtight';
import { isFinite, isFloat, isString, round } from '../utils';

/**
 * Trim white-space from both ends of string
 */
export const trim: Mutator<boolean> = ({ value, options }) => {
  if (options !== true) return value;
  if (!isString(value)) return value;

  return String.prototype.trim.call(value);
};

/**
 * Convert to lowercase
 */
export const lower: Mutator<boolean> = ({ value, options }) => {
  if (options !== true) return value;
  if (!isString(value)) return value;

  return String.prototype.toLowerCase.call(value);
};

/**
 * Convert to uppercase
 */
export const upper: Mutator<boolean> = ({ value, options }) => {
  if (options !== true) return value;
  if (!isString(value)) return value;

  return String.prototype.toUpperCase.call(value);
};

/**
 * Round to decimals
 */
const DEFAULT_DECIMALS = 2;
export const decimals: Mutator<boolean | number> = ({ value, options }): number | unknown => {
  if (options === false) return value;
  if (!isFloat(value)) return value;

  const decimals = isFinite(options) ? round(Number(options), 0) : DEFAULT_DECIMALS;
  return round(Number(value), decimals);
};

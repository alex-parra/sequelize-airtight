import type { TypeChecker } from '../airtight';

import _ from 'lodash';

/**
 * Test if value is a string
 * @returns {boolean}
 */
export const isString: TypeChecker = _.isString;

/**
 * Test if value is a pure boolean
 * @returns {boolean}
 */
export const isBool: TypeChecker = _.isBoolean;

/**
 * Test if value is an array
 * @returns {boolean}
 */
export const isArray: TypeChecker = Array.isArray;

/**
 * Test if value is a number (type `number` including `Infinity` and `NaN`)
 * @returns {boolean}
 */
export const isNumber: TypeChecker = _.isNumber;

/**
 * Test if value is a finite number (type `number` excluding `Infinity` or `NaN`)
 * @returns {boolean}
 */
export const isFinite: TypeChecker = Number.isFinite;

/**
 * Test if value is a float number
 * @returns {false} if number is integer or isn't a number (finite)
 * @returns {true} if number is float
 */
export const isFloat: TypeChecker = (value) => {
  if (!isFinite(value)) return false;

  return Number(value) % 1 !== 0;
};

/**
 * Test if value is an even number
 * @returns {false} if number is odd or isn't a number (finite)
 * @returns {true} if number is even
 */
export const isEven: TypeChecker = (value) => {
  if (!isFinite(value)) return false;

  return Number(value) % 2 === 0;
};

/**
 * Test if value is an odd number
 * @returns {false} if number is even or isn't a number (finite)
 * @returns {true} if number is odd
 */
export const isOdd: TypeChecker = (value) => {
  if (!isFinite(value)) return false;

  return !isEven(value);
};

/**
 * Round value to `decimals` precision
 * @returns value unchanged if isn't a float number
 * @returns {float} float number rounded to specified decimals
 */
export const round = (value: number, decimals = 2): number => {
  if (!isFloat(value)) return value;

  return _.round(value, decimals);
};

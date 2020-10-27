import type { Mutator, TypeChecks } from '../airtight';

const typeCheckers: TypeChecks = {
  string: (value) => String(value) === value,
};

/**
 * Validate that `value` is one of the specified types
 * eg: `isType: 'string|Date'`
 */
export const isType: Mutator<boolean | string> = ({ value, options, attrName }) => {
  if (value == null) return value; // skip null or undefined (use allowNull: false)
  if (options === false) return value;
  if (typeof options !== 'string') {
    throw TypeError('param of isType must be `false` or csv of types');
  }

  const types: string[] = options.split('|').map((type) => type.trim());
  const checks: boolean[] = types.map((type) => {
    if (type in typeCheckers) return typeCheckers[type](value);
    throw TypeError('Type `' + type + '` is not supported by `isType`');
  });

  if (checks.some(Boolean)) return value;
  throw Error(`Field ${attrName} is not of type ${options}`);
};

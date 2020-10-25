import type Airtight from './airtight';

type MutatorName = keyof (Airtight.GetMutators | Airtight.SetMutators | Airtight.Validators);

/**
 * Apply mutators/validators in the order specified
 */
export const mutate: Airtight.Mutate = (allMutators, mutatorsToApply, value, instance, attrName, attr) => {
  return Object.entries(mutatorsToApply).reduce((mutated, [mutatorName, mutatorParam]) => {
    if (!(mutatorName in allMutators)) return mutated;
    if (mutatorParam === false) return mutated;

    const mutator: Airtight.Mutator<unknown> = allMutators[mutatorName as MutatorName];

    return mutator({ value: mutated, options: mutatorParam, instance, attrName, attr });
  }, value);
};

/**
 * Apply a `get` to `attr` if none exists
 */
export const attrGet: Airtight.AttrGet = (attrName, attr) => {
  if (attr.get) return attr.get;
  return function () {
    return this.getDataValue(attrName);
  };
};

/**
 * Apply a `set` to `attr` if none exists
 */
export const attrSet: Airtight.AttrSet = (attrName, attr) => {
  if (attr.set) return attr.set;
  return function (value) {
    this.setDataValue(attrName, value);
  };
};

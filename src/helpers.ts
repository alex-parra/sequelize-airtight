import type Airtight from './airtight';

type MutatorName = keyof (Airtight.GetMutators | Airtight.SetMutators | Airtight.Validators);

/**
 * Apply mutators in the order specified
 */
export const mutate: Airtight.Mutate = (allMutators, mutatorsToApply, value, instance, attrName, attr) => {
  const eligible = Object.entries(mutatorsToApply).filter(([mutatorName, mutatorParam]) => {
    if (!(mutatorName in allMutators)) return false;
    if (mutatorParam === false) return false;
    return true;
  });

  return eligible.reduce((mutated, [mutatorName, mutatorParam]) => {
    const mutator: Airtight.Mutator<unknown> = allMutators[mutatorName as MutatorName];
    return mutator({ value: mutated, options: mutatorParam, instance, attrName, attr });
  }, value);
};

/**
 * Apply validators in the order specified
 * @async
 */
export const validate: Airtight.Mutate = (allValidators, validatorsToApply, value, instance, attrName, attr) => {
  const eligible = Object.entries(validatorsToApply).filter(([validatorName, validatorParam]) => {
    if (!(validatorName in allValidators)) return false;
    if (validatorParam === false) return false;
    return true;
  });

  const validations = eligible.map(async ([validatorName, validatorParam]) => {
    const validator: Airtight.Mutator<unknown> = allValidators[validatorName as MutatorName];
    await validator({ value, options: validatorParam, instance, attrName, attr });
  });

  return Promise.all(validations);
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

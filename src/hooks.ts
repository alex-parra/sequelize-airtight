import type Airtight from './airtight';
import { ValidationError, ValidationErrorItem } from 'sequelize';
import { mutate, validate, attrGet, attrSet } from './helpers';
import { getters, setters, validators } from './mutators';

/**
 * Call in beforeDefine hook to apply mutators processing
 * @param {ModelAttributes}
 * @param {ModelOptions}
 */
export const beforeDefine: Airtight.BeforeDefine = (modelAttrs, modelOptions) => {
  Object.entries(modelAttrs).map(([attrName, attr]) => {
    const mutators = attr.airtight || ({} as Airtight.ColumnMutators);

    if (mutators.get) {
      const get = attrGet(attrName, attr);
      attr.get = function () {
        const value = get.call(this);
        return mutate(getters, mutators.get as Airtight.GetMutators, value, this, attrName, attr);
      };
    }

    if (mutators.set) {
      const set = attrSet(attrName, attr);
      attr.set = function (value) {
        const mutated = mutate(setters, mutators.set as Airtight.SetMutators, value, this, attrName, attr);
        set.call(this, mutated);
      };
    }
  });
};

/**
 * Augments the model instance to add `beforeValidate` hook
 * @param {ModelDefined} instance An instance of a model
 */
export const afterDefine: Airtight.AfterDefine = (instance) => {
  instance.addHook('beforeValidate', beforeValidate);
};

/**
 * Runs Airtight validation
 * @param {ModelDefined} instance An instance of a model
 * @param {object} options
 */
const beforeValidate: Airtight.BeforeValidate = async (instance, options) => {
  const attrs: Airtight.ModelAttrs = instance.rawAttributes;

  const changed: string[] = instance.changed();
  if (!Array.isArray(changed)) return;

  const promises = changed.map(async (attrName) => {
    const attr = attrs[attrName];
    const { vet = {} } = attr.airtight || {};

    try {
      await validate(validators, vet, instance.getDataValue(attrName), instance, attrName, attr);
    } catch (e) {
      const error = new ValidationErrorItem(e.message);
      throw new ValidationError('Airtight Validation Failed', [error]);
    }
  });

  return Promise.all(promises);
};

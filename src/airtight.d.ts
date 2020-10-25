import type {
  Sequelize,
  Model,
  ModelAttributes,
  ModelOptions,
  ModelAttributeColumnOptions,
  ModelDefined,
} from 'sequelize';

import { validators, getters, setters } from './mutators';

export interface Export {
  default: Init;
  init: Init;
}

export interface Init {
  (sequelize: Sequelize): void;
}

export interface BeforeDefine {
  (modelAttrs: ModelAttrs, modelOptions: ModelOptions): void;
}

export interface AfterDefine {
  (instance: ModelDefined): void;
}

export interface BeforeValidate {
  (instance: ModelDefined, options: ModelOptions);
}

export interface Mutator<O extends unknown> {
  (args: { value: unknown; options: O; instance: Model; attrName: string; attr: Attr }): unknown;
}

export interface Mutators {
  [key: string]: Mutator<O>;
}

export interface Validators {
  [key: keyof validators]: Mutator<O>;
}

export interface GetMutators {
  [name: keyof getters]: Mutator<O>;
}

export interface SetMutators {
  [name: keyof setters]: Mutator<O>;
}

export interface ColumnMutators {
  set?: SetMutators;
  get?: GetMutators;
  v8n?: Validators;
}

export interface Attr extends ModelAttributeColumnOptions {
  airtight?: ColumnMutators;
}

export interface ModelAttrs extends ModelAttributes {
  [key: string]: Attr;
}

export interface Mutate {
  (
    allMutators: Mutators | Validators,
    mutatorsToApply: GetMutators | SetMutators | Validators,
    value: unknown,
    instance: Model,
    attrName: string,
    attr: Attr,
  ): unknown;
}

export interface AttrGet {
  (attrName: string, attr: Attr): (this: Model) => unknown;
}

export interface AttrSet {
  (attrName: string, attr: Attr): (this: Model, value: unknown) => void;
}

export interface TypeChecks {
  [key: string]: (value: unknown) => boolean;
}

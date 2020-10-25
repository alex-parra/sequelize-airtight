import type { Mutators, Validators } from '../airtight';

import { isType } from './type-check';
import { trim } from './mutators';

export const getters: Mutators = { trim };
export const setters: Mutators = { trim };
export const validators: Validators = { isType };

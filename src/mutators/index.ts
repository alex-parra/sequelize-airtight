import type { Mutators, Validators } from '../airtight';

import { isType } from './type-check';
import { trim, lower, upper } from './mutators';

export const getters: Mutators = { trim, lower, upper };
export const setters: Mutators = { trim, lower, upper };
export const validators: Validators = { isType };

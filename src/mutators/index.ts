import type { Mutators, Validators } from '../airtight';

import { isType } from './type-check';
import { trim, lower } from './mutators';

export const getters: Mutators = { trim, lower };
export const setters: Mutators = { trim, lower };
export const validators: Validators = { isType };

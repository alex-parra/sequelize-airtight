import type { Mutators, Validators } from '../airtight';

import { isType } from './type-check';
import { trim, lower, upper, decimals } from './mutators';

export const getters: Mutators = { trim, lower, upper, decimals };
export const setters: Mutators = { trim, lower, upper, decimals };
export const validators: Validators = { isType };

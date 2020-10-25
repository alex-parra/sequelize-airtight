import type { Sequelize } from 'sequelize';
import type Airtight from './airtight';
import { beforeDefine, afterDefine } from './hooks';

/**
 * Init Airtight into sequelize.
 * - must be called before loading models
 *
 * @param {Sequelize} sequelize The sequelize instance
 * @returns void
 */
const init = (sequelize: Sequelize): void => {
  sequelize.addHook('beforeDefine', beforeDefine);
  sequelize.addHook('afterDefine', afterDefine);
};

const airtightExport: Airtight.Export = {
  default: init,
  init: init,
};

export = airtightExport;

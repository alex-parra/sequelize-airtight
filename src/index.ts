import type { Sequelize } from 'sequelize';

interface Airtight_Export {
  default: (sequelize: Sequelize) => void;
  init: (sequelize: Sequelize) => void;
}

const init = (sequelize: Sequelize): void => {
  console.log('AIRTIGHT-init');
  sequelize.addHook('beforeDefine', () => {
    console.log('AIRTIGHT-beforeDefine');
  });
};

const airtight: Airtight_Export = { default: init, init };

export = airtight;

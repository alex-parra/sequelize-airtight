const prefix = 'sequelize_v';

let version = process.env.SEQUELIZE_VERSION || '6';
if (!['5', '6'].includes(version)) version = '6';

const { Sequelize, DataTypes } = require(prefix + version);

module.exports = {
  Sequelize,
  DataTypes,
};

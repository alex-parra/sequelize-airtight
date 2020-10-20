const Sequelize = require('sequelize');
const loadModels = require('./models');

let sequelize;

const defaults = {
  dialect: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  logging: false,
  define: {
    underscored: true,
  },
};

module.exports = {
  init: async (options) => {
    sequelize = new Sequelize({ ...defaults, ...options });
    loadModels(sequelize);
    await sequelize.sync();
    return sequelize;
  },
};

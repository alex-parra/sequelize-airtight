const Sequelize = require('sequelize');
const loadModels = require('./models');

const airtight = require('../../lib');

let sequelize;

const defaults = {
  dialect: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  logging: false,
  typeValidation: false, // default. Set to `true` to prevent some type issues
  define: {
    underscored: true,
  },
};

module.exports = {
  /**
   * - Initialize DB connection
   * - Load models
   * - Sync Database with models
   * @returns {Sequelize} The sequelize instance
   */
  init: async (options) => {
    sequelize = new Sequelize({ ...defaults, ...options });

    // Init Airtight into sequelize. Must be called before loading models
    airtight.init(sequelize);

    loadModels(sequelize);
    await sequelize.sync({ force: true });
    return sequelize;
  },
};

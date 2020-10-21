const { init, dbReset } = require('.');

exports.mochaHooks = {
  beforeAll: async () => {
    console.log('# Sequelize Airtight #', '\n');
    await init();
  },

  afterEach: async () => {
    await dbReset();
  },
};

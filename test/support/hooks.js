const { init, dbReset, Sequelize, airtightVersion } = require('.');

exports.mochaHooks = {
  beforeAll: async () => {
    console.log(`# Sequelize Airtight v${airtightVersion}      [ Sequelize v${Sequelize.version} ]`);
    console.log('\n');
    await init();
  },

  afterAll: async () => {
    console.log('-----------------------------------------');
    console.log('  Versions tested:');
    console.log(`  - Airtight v${airtightVersion}`);
    console.log(`  - Sequelize v${Sequelize.version}`);
    console.log('-----------------------------------------');
  },

  afterEach: async () => {
    await dbReset();
  },
};

const expect = require('chai').expect;
const { Sequelize } = require('sequelize');

const { d, init } = require('./support');

describe(d('Sequelize setup'), () => {
  it('connected, synced and models loaded', async () => {
    const { db, models } = await init();
    expect(db).to.be.instanceOf(Sequelize);
    expect(models).to.equal(db.models);
  });

  it('Model User works', async () => {
    const { models } = await init();
    const resEmpty = await models.User.findAll();
    expect(resEmpty).to.be.an('array').with.lengthOf(0);
  });
});

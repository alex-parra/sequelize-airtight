const expect = require('chai').expect;

const { init, dbReset } = require('./support/app');

describe('sequelize init', () => {
  afterEach(dbReset);

  it('db is synced and models work', async () => {
    const { models } = await init();
    const resEmpty = await models.User.findAll();
    expect(resEmpty).to.be.an('array').with.lengthOf(0);

    const user = await models.User.create({ email: 'alex.parra@test.dev' });
    expect(user.email).to.equal('alex.parra@test.dev');

    const resOne = await models.User.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });
});

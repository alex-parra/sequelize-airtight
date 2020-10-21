const expect = require('chai').expect;

const { d, init } = require('./support');

describe(d('Model User basics'), () => {
  it('should create with Model.create', async () => {
    const { models } = await init();
    const user = await models.User.create({ email: 'alex.parra@test.dev' });
    expect(user.id).to.be.a('number').greaterThan(0);
    expect(user.email).to.equal('alex.parra@test.dev');
    expect(user.createdAt).to.be.a('Date');
    expect(user.updatedAt).to.be.a('Date');
    const resOne = await models.User.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });

  it('should find with Model.findAll', async () => {
    const { models } = await init();
    await models.User.create({ email: 'alex.parra@test.dev' });
    const resOne = await models.User.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });
});

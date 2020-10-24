const expect = require('chai').expect;

const { d, init } = require('./support');

const testUserData = { email: 'alex.parra@test.dev' };

describe(d('User Model'), () => {
  it('should create with User.create', async () => {
    const { models } = await init();
    const user = await models.User.create(testUserData);
    expect(user.id).to.be.a('number').greaterThan(0);
    expect(user.email).to.equal(testUserData.email);
    const resOne = await models.User.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });

  it('should find with User.findAll', async () => {
    const { models } = await init();
    await models.User.create(testUserData);
    const resOne = await models.User.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });

  it('should update with user.update', async () => {
    const { models } = await init();
    const user = await models.User.create(testUserData);
    expect(user.name).to.be.null;
    const updated = await user.update({ name: 'Alex Parra' });
    expect(updated.name).to.equal('Alex Parra');
    expect(user.name).to.equal(updated.name);
  });

  it('should delete with user.destroy', async () => {
    const { models } = await init();
    const f0 = await models.User.findAll();
    expect(f0).to.be.an('array').with.lengthOf(0);

    const user = await models.User.create(testUserData);
    expect(user.id).to.be.a('number').greaterThan(0);
    const f1 = await models.User.findAll();
    expect(f1).to.be.an('array').with.lengthOf(1);

    await user.destroy();
    const f2 = await models.User.findAll();
    expect(f2).to.be.an('array').with.lengthOf(0);
  });

  // id -----------------------------------------------
  describe('field: id', () => {
    /**
     * In most cases, this is not desirable when `id` is auto-increment
     * Airtight allows preventing this
     */
    it('allows setting id on new instance (!)', async () => {
      const { models } = await init();
      const user = await models.User.create({ ...testUserData, id: 123 });
      expect(user.id).to.equal(123);
    });

    /**
     * Changing a record's id is usually not desirable
     * Good that sequelize prevents it
     */
    it('does not update id on an existing instance', async () => {
      const { models } = await init();
      const user = await models.User.create(testUserData);
      expect(user.id).to.be.a('number').greaterThan(0);

      // Set `id` does not change value of id
      const id = user.id;
      expect(id).not.to.equal(999);
      user.id = 999;
      expect(user.id).not.to.equal(999);

      // Updating `id` does not change value of id
      const updated = await user.update({ id: 888 });
      expect(updated.id).to.equal(id);
      expect(updated.id).not.to.equal(999);
      expect(updated.id).not.to.equal(888);
    });
  });

  // email -----------------------------------------------
  describe('field: email', () => {
    it('does not allow null {allowNull: false}', async () => {
      const { models } = await init();
      const res = await models.User.create({ name: 'John Doe' }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');
    });

    it('must be valid email {isEmail: true}', async () => {
      const { models } = await init();
      const res = await models.User.create({ email: '   ' }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');
    });

    /**
     * Leading/trailing white-space causes `isEmail` to fail
     * But it could pass if it where trimmed.
     * Airtight allows preventing this
     */
    it('does not trim on set', async () => {
      const { models } = await init();
      const res = await models.User.create({ email: ` ${testUserData.email} ` }).catch((e) => e);
      expect(res).to.be.an('Error'); // fails due to {isEmail: true}
      expect(res.name).to.equal('SequelizeValidationError');
    });

    /**
     * Email is case-insensitive per spec so should be lowercased always.
     * Not normalizing emails can lead to duplicates that `unique` can't catch
     * Airtight allows preventing this
     */
    it('does not lowercase on set', async () => {
      const testEmail = 'Alex.PARRA@test.dev';
      const { models } = await init();
      const user1 = await models.User.create({ email: testEmail });
      expect(user1.id).to.be.a('number').greaterThan(0);
      expect(user1.email).to.equal(testEmail);

      const user2 = await models.User.create({ email: testEmail.toLowerCase() });
      expect(user2.id).to.be.a('number').greaterThan(0);
      expect(user2.email).not.to.equal(testEmail);

      expect(user1.id).not.to.equal(user2.id);
    });
  });

  // name -----------------------------------------------
  describe('field: name', () => {
    it('allows null {allowNull: true}', async () => {
      const { models } = await init();
      const { name, ...noName } = testUserData; // eslint-disable-line no-unused-vars
      const user = await models.User.create(noName);
      expect(user.id).to.be.a('number').greaterThan(0);
      expect(user.name).to.be.null;
    });

    it('does not allow empty string {len: [1]}', async () => {
      const { models } = await init();
      const res = await models.User.create({ ...testUserData, name: '' }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');
    });

    it('does not allow over length 255 {len: [1, 255]}', async () => {
      const { models } = await init();
      const name = Array.from({ length: 256 }, () => 'a').join('');
      const overLength = await models.User.create({ ...testUserData, name }).catch((e) => e);
      expect(overLength).to.be.an('Error');
      expect(overLength.name).to.equal('SequelizeValidationError');

      const okLength = await models.User.create({ ...testUserData, name: name.substring(1) });
      expect(okLength.id).to.be.a('number').greaterThan(0);
      expect(okLength.name).to.equal(name.substring(1));
    });

    /**
     * This can lead to duplicates that `unique` can't catch
     * Airtight allows preventing this
     */
    it('does not trim on set', async () => {
      const { models } = await init();
      const name = 'Alex Parra';
      const user = await models.User.create({ ...testUserData, name: ` ${name} ` });
      expect(user.id).to.be.a('number').greaterThan(0);
      expect(user.name).not.to.equal(name);
    });

    it('accepts a white-space string (!)', async () => {
      const { models } = await init();
      const name = '   ';
      const user = await models.User.create({ ...testUserData, name });
      expect(user.id).to.be.a('number').greaterThan(0);
      expect(user.name).to.equal(name);
    });

    it('accepts a line-break (\\n) string (!)', async () => {
      const { models } = await init();
      const name = '\n';
      const user = await models.User.create({ ...testUserData, name });
      expect(user.id).to.be.a('number').greaterThan(0);
      expect(user.name).to.equal(name);
    });

    it('accepts a tab (\\t) string (!)', async () => {
      const { models } = await init();
      const name = '\t';
      const user = await models.User.create({ ...testUserData, name });
      expect(user.id).to.be.a('number').greaterThan(0);
      expect(user.name).to.equal(name);
    });

    it('accepts a number (!)', async () => {
      const { models } = await init();
      const name = 1234; // Even if someone is named `1234` it should be a string
      const user = await models.User.create({ ...testUserData, name });
      expect(user.id).to.be.a('number').greaterThan(0);
      expect(user.name).to.equal(`${name}`); // it's just converted to string
    });

    // Fixable with `typeValidation: true` on sequelize init
    it('accepts a boolean (!)', async () => {
      const { models } = await init();
      const name = true; // Even if someone is named `true` it should be a string
      const user = await models.User.create({ ...testUserData, name });
      expect(user.id).to.be.a('number').greaterThan(0);
      expect(user.name).to.equal(`${name}`); // it's just converted to string
    });
  });

  // dateOfBirth -----------------------------------------------
  describe('field: dateOfBirth', () => {
    it('accepts a date string', async () => {
      const { models } = await init();
      const dateOfBirth = new Date('1980-04-27').toISOString();
      expect(dateOfBirth).to.be.a('string');
      const user1 = await models.User.create({ ...testUserData, dateOfBirth });
      expect(user1.id).to.be.a('number').greaterThan(0);
      expect(user1.dateOfBirth).to.be.a('Date');
      expect(user1.dateOfBirth.toISOString()).to.equal(dateOfBirth);
    });

    it('does not accept a spaced date string {isDate: true}', async () => {
      const { models } = await init();
      const dateOfBirth = new Date('1980-04-27').toISOString();
      expect(dateOfBirth).to.be.a('string');
      const res = await models.User.create({ ...testUserData, dateOfBirth: ` ${dateOfBirth} ` }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');
    });

    it('accepts a date instance', async () => {
      const { models } = await init();
      const dateOfBirth = new Date('1980-04-27');
      expect(dateOfBirth).to.be.a('Date');
      const user1 = await models.User.create({ ...testUserData, dateOfBirth });
      expect(user1.id).to.be.a('number').greaterThan(0);
      expect(user1.dateOfBirth).to.be.a('Date');
      expect(user1.dateOfBirth.toISOString()).to.equal(dateOfBirth.toISOString());
    });

    /**
     * This leads to wild results...
     * Airtight allows preventing this
     */
    it('accepts a number (!)', async () => {
      const { models } = await init();
      const dateOfBirth = 1980;
      expect(dateOfBirth).to.be.a('number');
      const user1 = await models.User.create({ ...testUserData, dateOfBirth });
      expect(user1.id).to.be.a('number').greaterThan(0);
      expect(user1.dateOfBirth).to.be.a('Date');
    });

    /**
     * This leads to even wilder results...
     * Airtight allows preventing this
     */
    it('accepts a boolean (!)', async () => {
      const { models } = await init();
      const dateOfBirth = true;
      expect(dateOfBirth).to.be.a('boolean');
      const user1 = await models.User.create({ ...testUserData, dateOfBirth });
      expect(user1.id).to.be.a('number').greaterThan(0);
      expect(user1.dateOfBirth).to.be.a('Date');
    });
  });

  // timestamps
  describe('field validation: timestamps', () => {
    it('has createdAt and updatedAt', async () => {
      const { models } = await init();
      const actual = await models.User.create(testUserData);
      expect(actual.createdAt).to.be.a('Date');
      expect(actual.updatedAt).to.be.a('Date');
    });
  });
});

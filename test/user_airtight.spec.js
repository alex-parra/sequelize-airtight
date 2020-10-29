const expect = require('chai').expect;

const { d, init, getErr } = require('./support');

const testUserData = { email: 'alex.parra@test.dev' };

describe(d('User Model - Airtight fields'), () => {
  // emailAirtight -----------------------------------------------
  describe('field: emailAirtight', () => {
    /**
     * Leading/trailing white-space causes `isEmail` to fail
     * With `airtight.set.trim`
     */
    it('trims on set', async () => {
      const { models } = await init();
      const r = await models.User.create({ ...testUserData, emailAirtight: ` ${testUserData.email} ` }).catch(getErr);
      expect(r).not.to.be.an('Error');
      expect(r.id).to.be.a('number').greaterThan(0);
      expect(r.emailAirtight).to.equal(testUserData.email);
    });

    /**
     * Inconsistent casing causes `unique` to fail as the strings are in fact different
     * With `airtight.set.lower`
     */
    it('to lowercase on set', async () => {
      const { models } = await init();
      const emailLower = 'alex.parra@test.dev';
      const emailUpper = 'Alex.Parra@test.dev';
      const testData = { ...testUserData, email: emailUpper, emailAirtight: emailUpper };
      const r = await models.User.create(testData).catch(getErr);
      expect(r).not.to.be.an('Error');
      expect(r.id).to.be.a('number').greaterThan(0);
      expect(r.email).to.equal(emailUpper);
      expect(r.emailAirtight).to.equal(emailLower);
    });
  });

  // nameAirtight -----------------------------------------------
  describe('field: nameAirtight', () => {
    it('requires string', async () => {
      const { models } = await init();
      const name = 123456;
      const r = await models.User.create({ ...testUserData, nameAirtight: name }).catch(getErr);
      expect(r).to.be.an('Error');
      expect(r.name).to.equal('SequelizeValidationError');
    });

    /**
     * Leading/trailing white-space causes `unique` to fail
     * With `airtight.set.trim`
     */
    it('trims on set', async () => {
      const { models } = await init();
      const name = 'Alex Parra';
      const r = await models.User.create({ ...testUserData, nameAirtight: ` ${name} ` }).catch(getErr);
      expect(r).not.to.be.an('Error');
      expect(r.id).to.be.a('number').greaterThan(0);
      expect(r.nameAirtight).to.equal(name);
    });
  });
});

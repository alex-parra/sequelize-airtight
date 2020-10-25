const expect = require('chai').expect;

const { d, init } = require('./support');

const testHostData = { User: { email: 'alex.parra@test.dev' } };

describe(d('Host Model'), () => {
  it('should add a host', async () => {
    const { models } = await init();
    const host = await models.Host.create({ ...testHostData, taxNumber: '1234-5678' }, { include: 'User' });
    expect(host.id).to.be.a('number').greaterThan(0);
    expect(host.User.email).to.equal(testHostData.User.email);
    expect(host.iban).to.be.null;
    expect(host.taxNumber).to.equal('1234-5678');
    const resOne = await models.Host.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });

  it('should find a host', async () => {
    const { models } = await init();
    await models.Host.create(testHostData, { include: 'User' });
    const resOne = await models.Host.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });

  it('should update a host', async () => {
    const { models } = await init();
    const iban = 'PT1234567890987654321';
    const actual = await models.Host.create(testHostData, { include: 'User' });
    expect(actual.iban).to.be.null;
    const updated = await actual.update({ iban });
    expect(updated.iban).to.equal(iban);
  });

  it('should delete a host', async () => {
    const { models } = await init();
    const r1 = await models.Host.findAll();
    expect(r1).to.be.an('array').with.lengthOf(0);
    const actual = await models.Host.create(testHostData, { include: 'User' });
    const r2 = await models.Host.findAll();
    expect(r2).to.be.an('array').with.lengthOf(1);
    await actual.destroy();
    const r3 = await models.Host.findAll();
    expect(r3).to.be.an('array').with.lengthOf(0);
  });

  // id -----------------------------------------------
  describe('field: id', () => {
    /**
     * In most cases, this is not desirable when `id` is auto-increment
     * Airtight allows preventing this
     */
    it('allows setting id on new instance (!)', async () => {
      const { models } = await init();
      const host = await models.Host.create({ ...testHostData, id: 123 }, { include: 'User' });
      expect(host.id).to.equal(123);
    });

    /**
     * Changing a record's id is usually not desirable
     * Good that sequelize prevents it
     */
    it('does not update id on an existing instance', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);

      // Set `id` does not change value of id
      const id = host.id;
      expect(id).not.to.equal(999);
      host.id = 999;
      expect(host.id).not.to.equal(999);

      // Updating `id` does not change value of id
      const updated = await host.update({ id: 888 });
      expect(updated.id).to.equal(id);
      expect(updated.id).not.to.equal(999);
      expect(updated.id).not.to.equal(888);
    });
  });

  // iban -----------------------------------------------
  describe('field: iban', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { iban, ...noIban } = testHostData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(noIban, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.iban).to.be.null;
    });

    it('ensures min length {len: [10]}', async () => {
      const { models } = await init();
      const iban = '1234567890';
      const shortLen = { ...testHostData, iban: iban.substring(1) };
      const res = await models.Host.create(shortLen, { include: 'User' }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');

      const host = await models.Host.create({ ...testHostData, iban }, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.iban).to.equal(iban);
    });

    it('ensures max length {len: [, 21]}', async () => {
      const { models } = await init();
      const iban = Array.from({ length: 22 }, () => '1').join('');
      const res = await models.Host.create({ ...testHostData, iban }, { include: 'User' }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');

      const host = await models.Host.create({ ...testHostData, iban: iban.substring(1) }, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.iban).to.equal(iban.substring(1));
    });

    it('allows number (!)', async () => {
      const { models } = await init();
      const iban = 1234567890;
      const host = await models.Host.create({ ...testHostData, iban }, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.iban).to.equal(`${iban}`);
    });
  });

  // taxNumber -----------------------------------------------
  describe('field: taxNumber', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { taxNumber, ...noTaxNumber } = testHostData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(noTaxNumber, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.taxNumber).to.be.null;
    });

    it('ensures min length {len: [7]}', async () => {
      const { models } = await init();
      const taxNumber = '1234567';
      const shortLen = { ...testHostData, taxNumber: taxNumber.substring(1) };
      const res = await models.Host.create(shortLen, { include: 'User' }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');

      const host = await models.Host.create({ ...testHostData, taxNumber }, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.taxNumber).to.equal(taxNumber);
    });

    it('ensures max length {len: [, 11]}', async () => {
      const { models } = await init();
      const taxNumber = Array.from({ length: 12 }, () => '1').join('');
      const res = await models.Host.create({ ...testHostData, taxNumber }, { include: 'User' }).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');

      const host = await models.Host.create(
        { ...testHostData, taxNumber: taxNumber.substring(1) },
        { include: 'User' },
      );
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.taxNumber).to.equal(taxNumber.substring(1));
    });

    it('allows number (!)', async () => {
      const { models } = await init();
      const taxNumber = 1234567;
      const host = await models.Host.create({ ...testHostData, taxNumber }, { include: 'User' });
      expect(host.id).to.be.a('number').greaterThan(0);
      expect(host.taxNumber).to.equal(`${taxNumber}`);
    });
  });

  // timestamps
  describe('field validation: timestamps', () => {
    it('has createdAt and updatedAt', async () => {
      const { models } = await init();
      const actual = await models.Host.create(testHostData, { include: 'User' });
      expect(actual.createdAt).to.be.a('Date');
      expect(actual.updatedAt).to.be.a('Date');
    });
  });
});

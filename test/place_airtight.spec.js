const expect = require('chai').expect;

const { d, init } = require('./support');

const testHostData = { User: { email: 'alex.parra@test.dev' } };
const testPlaceData = { name: 'Tree House' };

describe(d('Place Model - Airtight fields'), () => {
  // publishedAirtight -----------------------------------------------
  describe('field: publishedAirtight', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { publishedAirtight, ...noPublishedAirtight } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...noPublishedAirtight, hostId: host.id }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.publishedAirtight).to.be.false;
    });

    it('allows boolean', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asBool = { ...testPlaceData, hostId: host.id, publishedAirtight: true };
      const place = await models.Place.create(asBool).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.publishedAirtight).to.be.true;
    });

    it('allows number (`0`, `1`)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asOne = { ...testPlaceData, hostId: host.id, publishedAirtight: 1 };
      const place = await models.Place.create(asOne).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.publishedAirtight).to.be.true;
    });

    it('does not allow string (`0`, `1`)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asOneStr = { ...testPlaceData, hostId: host.id, publishedAirtight: '1' };
      const place = await models.Place.create(asOneStr).catch((e) => e);
      expect(place).to.be.an('Error');
      expect(place.name).to.equal('SequelizeValidationError');
    });

    it('does not allow string', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asStr = { ...testPlaceData, hostId: host.id, publishedAirtight: 'yes' };
      const place = await models.Place.create(asStr).catch((e) => e);
      expect(place).to.be.an('Error');
      expect(place.name).to.equal('SequelizeValidationError');
    });

    it('does not allow number', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNum = { ...testPlaceData, hostId: host.id, publishedAirtight: 123 };
      const place = await models.Place.create(asNum).catch((e) => e);
      expect(place).to.be.an('Error');
      expect(place.name).to.equal('SequelizeValidationError');
    });
  });

  // maxGuestsAirtight -----------------------------------------------
  describe('field: maxGuestsAirtight', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { maxGuestsAirtight, ...noMaxGuests } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...noMaxGuests, hostId: host.id }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.maxGuestsAirtight).to.be.null;
    });

    it('allows number', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNumber = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 12345 };
      const place = await models.Place.create(asNumber).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.maxGuestsAirtight).to.equal(asNumber.maxGuestsAirtight);
    });

    /**
     * If the field is INTEGER only `number` should be allowed
     */
    it('does NOT allow string', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNumber = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: '12345' };
      const res = await models.Place.create(asNumber).catch((e) => e);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');
    });

    it('does not allow boolean {isInt: true}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asBool = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: true };
      const rBool = await models.Place.create(asBool).catch((e) => e);
      expect(rBool).to.be.an('Error');
      expect(rBool.name).to.equal('SequelizeValidationError');
    });

    it('requires integer {isInt: true}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asFloat = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 2.5 };
      const rFloat = await models.Place.create(asFloat).catch((e) => e);
      expect(rFloat).to.be.an('Error');
      expect(rFloat.name).to.equal('SequelizeValidationError');

      const asInt = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 3 };
      const rInt = await models.Place.create(asInt).catch((e) => e);
      expect(rInt).not.to.be.an('Error');
      expect(rInt.maxGuestsAirtight).to.equal(asInt.maxGuestsAirtight);
    });

    it('requires >= 1 {isInt: {min: 1}}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asZero = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 0 };
      const rZero = await models.Place.create(asZero).catch((e) => e);
      expect(rZero).to.be.an('Error');
      expect(rZero.name).to.equal('SequelizeValidationError');

      const asOne = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 1 };
      const rOne = await models.Place.create(asOne).catch((e) => e);
      expect(rOne).not.to.be.an('Error');
      expect(rOne.maxGuestsAirtight).to.equal(asOne.maxGuestsAirtight);
    });
  });
});

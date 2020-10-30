const expect = require('chai').expect;

const { d, init, getErr } = require('./support');

const testHostData = { User: { email: 'alex.parra@test.dev' } };
const testPlaceData = { name: 'Tree House' };

describe(d('Place Model - Airtight fields'), () => {
  // publishedAirtight -----------------------------------------------
  describe('field: publishedAirtight', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { publishedAirtight, ...noPublishedAirtight } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...noPublishedAirtight, hostId: host.id }).catch(getErr);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.publishedAirtight).to.be.false;
    });

    it('allows boolean', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asBool = { ...testPlaceData, hostId: host.id, publishedAirtight: true };
      const place = await models.Place.create(asBool).catch(getErr);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.publishedAirtight).to.be.true;
    });

    it('allows number (`0`, `1`)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asOne = { ...testPlaceData, hostId: host.id, publishedAirtight: 1 };
      const place = await models.Place.create(asOne).catch(getErr);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.publishedAirtight).to.be.true;
    });

    it('does not allow string (`0`, `1`)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asOneStr = { ...testPlaceData, hostId: host.id, publishedAirtight: '1' };
      const place = await models.Place.create(asOneStr).catch(getErr);
      expect(place).to.be.an('Error');
      expect(place.name).to.equal('SequelizeValidationError');
    });

    it('does not allow string', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asStr = { ...testPlaceData, hostId: host.id, publishedAirtight: 'yes' };
      const place = await models.Place.create(asStr).catch(getErr);
      expect(place).to.be.an('Error');
      expect(place.name).to.equal('SequelizeValidationError');
    });

    it('does not allow number', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNum = { ...testPlaceData, hostId: host.id, publishedAirtight: 123 };
      const place = await models.Place.create(asNum).catch(getErr);
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
      const place = await models.Place.create({ ...noMaxGuests, hostId: host.id }).catch(getErr);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.maxGuestsAirtight).to.be.null;
    });

    it('allows number', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNumber = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 12345 };
      const place = await models.Place.create(asNumber).catch(getErr);
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
      const res = await models.Place.create(asNumber).catch(getErr);
      expect(res).to.be.an('Error');
      expect(res.name).to.equal('SequelizeValidationError');
    });

    it('does not allow boolean {isInt: true}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asBool = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: true };
      const rBool = await models.Place.create(asBool).catch(getErr);
      expect(rBool).to.be.an('Error');
      expect(rBool.name).to.equal('SequelizeValidationError');
    });

    it('requires integer {isInt: true}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asFloat = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 2.5 };
      const rFloat = await models.Place.create(asFloat).catch(getErr);
      expect(rFloat).to.be.an('Error');
      expect(rFloat.name).to.equal('SequelizeValidationError');

      const asInt = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 3 };
      const rInt = await models.Place.create(asInt).catch(getErr);
      expect(rInt).not.to.be.an('Error');
      expect(rInt.maxGuestsAirtight).to.equal(asInt.maxGuestsAirtight);
    });

    it('requires >= 1 {isInt: {min: 1}}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asZero = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 0 };
      const rZero = await models.Place.create(asZero).catch(getErr);
      expect(rZero).to.be.an('Error');
      expect(rZero.name).to.equal('SequelizeValidationError');

      const asOne = { ...testPlaceData, hostId: host.id, maxGuestsAirtight: 1 };
      const rOne = await models.Place.create(asOne).catch(getErr);
      expect(rOne).not.to.be.an('Error');
      expect(rOne.maxGuestsAirtight).to.equal(asOne.maxGuestsAirtight);
    });
  });

  // countryAirtight -----------------------------------------------
  describe('field: countryAirtight', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { countryAirtight, ...noCountryAirtight } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...noCountryAirtight, hostId: host.id }).catch(getErr);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.countryAirtight).to.be.null;
    });

    it('allows valid country ISO3166-1 alpha-2', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asPT = { ...testPlaceData, hostId: host.id, countryAirtight: 'PT' };
      const place = await models.Place.create(asPT).catch(getErr);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.countryAirtight).to.equal('PT');
    });

    it('transforms to uppercase on set', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asLower = { ...testPlaceData, hostId: host.id, countryAirtight: 'pt' };
      const rLower = await models.Place.create(asLower).catch(getErr);
      expect(rLower).not.to.be.an('Error');
      expect(rLower.countryAirtight).to.equal('PT');
    });

    it('does not allow invalid code', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asXa = { ...testPlaceData, hostId: host.id, countryAirtight: 'XA' };
      const rXa = await models.Place.create(asXa).catch(getErr);
      expect(rXa).to.be.an('Error');
      expect(rXa.name).to.equal('SequelizeValidationError');

      const asPrt = { ...testPlaceData, hostId: host.id, countryAirtight: 'PRT' };
      const rPrt = await models.Place.create(asPrt).catch(getErr);
      expect(rPrt).to.be.an('Error');
      expect(rPrt.name).to.equal('SequelizeValidationError');

      const asP = { ...testPlaceData, hostId: host.id, countryAirtight: 'P' };
      const rP = await models.Place.create(asP).catch(getErr);
      expect(rP).to.be.an('Error');
      expect(rP.name).to.equal('SequelizeValidationError');
    });
  });
});

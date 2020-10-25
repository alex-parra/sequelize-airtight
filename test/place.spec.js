const expect = require('chai').expect;

const { d, init } = require('./support');

const testHostData = { User: { email: 'alex.parra@test.dev' } };
const testPlaceData = { name: 'Tree House' };

describe(d('Place Model'), () => {
  it('should add a place', async () => {
    const { models } = await init();
    const host = await models.Host.create(testHostData, { include: 'User' });
    expect(host.id).to.be.a('number').greaterThan(0);
    const place = await models.Place.create({ ...testPlaceData, hostId: host.id });
    expect(place.id).to.be.a('number').greaterThan(0);
    const resOne = await models.Place.findAll();
    expect(resOne).to.be.an('array').with.lengthOf(1);
  });

  it('should find places', async () => {
    const { models } = await init();
    const host = await models.Host.create(testHostData, { include: 'User' });
    expect(host.id).to.be.a('number').greaterThan(0);

    const r1 = await models.Place.findAll({ where: { hostId: host.id } });
    expect(r1).to.be.an('array').with.lengthOf(0);

    const placesData = ['Manor', 'Beach House'].map((name) => ({ ...testPlaceData, hostId: host.id, name }));
    await models.Place.bulkCreate(placesData, { validate: true });

    const r2 = await models.Place.findAll({ where: { hostId: host.id } });
    expect(r2).to.be.an('array').with.lengthOf(2);
  });

  it('should update a place', async () => {
    const { models } = await init();
    const host = await models.Host.create(testHostData, { include: 'User' });
    const place = await models.Place.create({ ...testPlaceData, hostId: host.id });
    expect(place.id).to.be.a('number').greaterThan(0);
    expect(place.name).to.equal(testPlaceData.name);
    const updated = await place.update({ name: 'Manor' });
    expect(updated.name).to.equal('Manor');
    expect(place.name).to.equal('Manor');
  });

  it('should delete a place', async () => {
    const { models } = await init();
    const host = await models.Host.create(testHostData, { include: 'User' });
    const r1 = await models.Place.findAll({ where: { hostId: host.id } });
    expect(r1).to.be.an('array').with.lengthOf(0);

    const placesData = ['Manor', 'Beach House'].map((name) => ({ ...testPlaceData, hostId: host.id, name }));
    await models.Place.bulkCreate(placesData, { validate: true });

    const r2 = await models.Place.findAll({ where: { hostId: host.id } });
    expect(r2).to.be.an('array').with.lengthOf(2);

    await r2[0].destroy();
    const places = await host.getPlaces();
    expect(places).to.be.an('array').with.lengthOf(1);
  });

  // id -----------------------------------------------
  describe('field: id', () => {
    /**
     * In most cases, this is not desirable when `id` is auto-increment
     * Airtight allows preventing this
     */
    it('allows setting id on new instance (!)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, id: 123 });
      expect(place.id).to.equal(123);
    });

    /**
     * Changing a record's id is usually not desirable
     * Good that sequelize prevents it
     */
    it('does not update id on an existing instance', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id });
      expect(place.id).to.be.a('number').greaterThan(0);

      // Set `id` does not change value of id
      const id = place.id;
      expect(id).not.to.equal(999);
      place.id = 999;
      expect(place.id).not.to.equal(999);

      // Updating `id` does not change value of id
      const updated = await place.update({ id: 888 });
      expect(updated.id).to.equal(id);
      expect(updated.id).not.to.equal(999);
      expect(updated.id).not.to.equal(888);
    });
  });

  // hostId -----------------------------------------------
  describe('field: hostId', () => {
    it('does not allow null {allowNull: false}', async () => {
      const { models } = await init();
      const { hostId, ...noHostId } = testPlaceData; // eslint-disable-line no-unused-vars
      const r = await models.Place.create({ ...noHostId }).catch((e) => e);
      expect(r).to.be.an('Error');
      expect(r.name).to.equal('SequelizeValidationError');
    });

    it('must exist {belongsTo(Host)}', async () => {
      const { models } = await init();
      const { hostId, ...noHostId } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.findByPk(9999);
      expect(host).to.be.null;
      const r = await models.Place.create({ ...testPlaceData, hostId: 9999 }).catch((e) => e);
      expect(r).to.be.an('Error');
      expect(r.name).to.equal('SequelizeForeignKeyConstraintError');
    });

    it('belongsTo Host as Host', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id });
      expect(place.id).to.be.an('number').greaterThan(0);
      expect(place.hostId).to.equal(host.id);
      const placeHost = await place.getHost();
      expect(placeHost.id).to.equal(host.id);
      expect(placeHost.userId).to.equal(host.userId);
    });
  });

  // name -----------------------------------------------
  describe('field: name', () => {
    it('does not allow null {allowNull: false}', async () => {
      const { models } = await init();
      const { name, ...noName } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const r = await models.Place.create({ ...noName, hostId: host.id }).catch((e) => e);
      expect(r).to.be.an('Error');
      expect(r.name).to.equal('SequelizeValidationError');
    });

    it('does not allow empty string {len: [3]}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const r = await models.Place.create({ ...testPlaceData, hostId: host.id, name: '' }).catch((e) => e);
      expect(r).to.be.an('Error');
      expect(r.name).to.equal('SequelizeValidationError');
    });

    it('does not allow over length 255 {len: [1, 255]}', async () => {
      const { models } = await init();
      const name = Array.from({ length: 256 }, () => 'a').join('');
      const host = await models.Host.create(testHostData, { include: 'User' });
      const overLength = await models.Place.create({ ...testPlaceData, hostId: host.id, name }).catch((e) => e);
      expect(overLength).to.be.an('Error');
      expect(overLength.name).to.equal('SequelizeValidationError');

      const okLength = await models.Place.create({ ...testPlaceData, hostId: host.id, name: name.substring(1) });
      expect(okLength.id).to.be.a('number').greaterThan(0);
      expect(okLength.name).to.equal(name.substring(1));
    });

    /**
     * This can lead to duplicates that `unique` can't catch
     * Airtight allows preventing this
     */
    it('does not trim on set (!)', async () => {
      const { models } = await init();
      const name = 'Beach Cabin';
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, name: ` ${name} ` }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.name).not.to.equal(name);
    });

    /**
     * This can lead to duplicates that `unique` can't catch
     * Airtight allows preventing this
     */
    it('accepts a white-space string (!)', async () => {
      const { models } = await init();
      const name = '   ';
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, name }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.name).to.equal(name);
    });

    /**
     * This can lead to duplicates that `unique` can't catch
     * Airtight allows preventing this
     */
    it('accepts a line-break (\\n) string (!)', async () => {
      const { models } = await init();
      const name = '\n\n\n';
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, name }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.name).to.equal(name);
    });

    /**
     * This can lead to duplicates that `unique` can't catch
     * Airtight allows preventing this
     */
    it('accepts a tab (\\t) string (!)', async () => {
      const { models } = await init();
      const name = '\t\t\t';
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, name }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.name).to.equal(name);
    });

    /**
     * If the field is STRING only `string` should be allowed
     * Airtight allows preventing this
     */
    it('accepts a number (!)', async () => {
      const { models } = await init();
      const name = 1234; // Even if a place is named `1234` it should be a string
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, name }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.name).to.equal(`${name}`); // it's just converted to string
    });

    /**
     * If the field is STRING only `string` should be allowed
     * Airtight allows preventing this
     * - `typeValidation: true` on sequelize init also prevents this
     */
    it('accepts a boolean (!)*', async () => {
      const { models } = await init();
      const name = true; // Even if someone is named `true` it should be a string
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, name }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.name).to.equal(`${name}`); // it's just converted to string
    });
  });

  // description -----------------------------------------------
  describe('field: description', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { description, ...noDescription } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...noDescription, hostId: host.id }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.description).to.be.null;
    });

    it('does not allow empty string', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, description: '' }).catch((e) => e);
      expect(place).to.be.an('Error');
      expect(place.name).to.equal('SequelizeValidationError');
    });

    /**
     * Only spaces string is rarely a valid value
     * Airtight allows preventing this
     */
    it('allows spaces string (!)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const onlySpaces = { ...testPlaceData, hostId: host.id, description: '   ' };
      const place = await models.Place.create(onlySpaces).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.description).to.equal(onlySpaces.description);
    });

    /**
     * Only line-break string is rarely a valid value
     * Airtight allows preventing this
     */
    it('allows \\n string (!)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const lineBreak = { ...testPlaceData, hostId: host.id, description: '\n' };
      const place = await models.Place.create(lineBreak).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.description).to.equal(lineBreak.description);
    });

    /**
     * Only tab string is rarely a valid value
     * Airtight allows preventing this
     */
    it('allows \\t string (!)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const lineBreak = { ...testPlaceData, hostId: host.id, description: '\t' };
      const place = await models.Place.create(lineBreak).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.description).to.equal(lineBreak.description);
    });

    /**
     * If the field is STRING only `string` should be allowed
     * Airtight allows preventing this
     * - `typeValidation: true` on sequelize init also prevents this
     */
    it('allows number (!)*', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNumber = { ...testPlaceData, hostId: host.id, description: 12345 };
      const place = await models.Place.create(asNumber).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.description).to.equal(`${asNumber.description}`);
    });

    /**
     * If the field is STRING only `string` should be allowed
     * Airtight allows preventing this
     * - `typeValidation: true` on sequelize init also prevents this
     */
    it('allows boolean (!)*', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNumber = { ...testPlaceData, hostId: host.id, description: true };
      const place = await models.Place.create(asNumber).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.description).to.equal(`${asNumber.description}`);
    });
  });

  // maxGuests -----------------------------------------------
  describe('field: maxGuests', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { maxGuests, ...noMaxGuests } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...noMaxGuests, hostId: host.id }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.maxGuests).to.be.null;
    });

    it('allows number', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNumber = { ...testPlaceData, hostId: host.id, maxGuests: 12345 };
      const place = await models.Place.create(asNumber).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.maxGuests).to.equal(asNumber.maxGuests);
    });

    /**
     * If the field is INTEGER only `number` should be allowed
     * Airtight allows preventing this
     */
    it('allows string (!)', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asNumber = { ...testPlaceData, hostId: host.id, maxGuests: '12345' };
      const place = await models.Place.create(asNumber).catch((e) => e);
      expect(place).not.to.be.an('Error');
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.maxGuests).to.equal(Number(asNumber.maxGuests));
    });

    it('does not allow boolean {isInt: true}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asBool = { ...testPlaceData, hostId: host.id, maxGuests: true };
      const rBool = await models.Place.create(asBool).catch((e) => e);
      expect(rBool).to.be.an('Error');
      expect(rBool.name).to.equal('SequelizeValidationError');
    });

    it('requires integer {isInt: true}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asFloat = { ...testPlaceData, hostId: host.id, maxGuests: 2.5 };
      const rFloat = await models.Place.create(asFloat).catch((e) => e);
      expect(rFloat).to.be.an('Error');
      expect(rFloat.name).to.equal('SequelizeValidationError');

      const asInt = { ...testPlaceData, hostId: host.id, maxGuests: 3 };
      const rInt = await models.Place.create(asInt).catch((e) => e);
      expect(rInt).not.to.be.an('Error');
      expect(rInt.maxGuests).to.equal(asInt.maxGuests);
    });

    it('requires >= 1 {isInt: {min: 1}}', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asZero = { ...testPlaceData, hostId: host.id, maxGuests: 0 };
      const rZero = await models.Place.create(asZero).catch((e) => e);
      expect(rZero).to.be.an('Error');
      expect(rZero.name).to.equal('SequelizeValidationError');

      const asOne = { ...testPlaceData, hostId: host.id, maxGuests: 1 };
      const rOne = await models.Place.create(asOne).catch((e) => e);
      expect(rOne).not.to.be.an('Error');
      expect(rOne.maxGuests).to.equal(asOne.maxGuests);
    });
  });

  // country -----------------------------------------------
  describe('field: country', () => {
    it('allows null', async () => {
      const { models } = await init();
      const { country, ...noCountry } = testPlaceData; // eslint-disable-line no-unused-vars
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...noCountry, hostId: host.id }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.country).to.be.null;
    });

    it('allows valid country ISO3166-1 alpha-2', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const place = await models.Place.create({ ...testPlaceData, hostId: host.id, country: 'PT' }).catch((e) => e);
      expect(place.id).to.be.a('number').greaterThan(0);
      expect(place.country).to.equal('PT');
    });

    it('does not allow invalid code', async () => {
      const { models } = await init();
      const host = await models.Host.create(testHostData, { include: 'User' });
      const asXa = { ...testPlaceData, hostId: host.id, country: 'XA' };
      const rXa = await models.Place.create(asXa).catch((e) => e);
      expect(rXa).to.be.an('Error');
      expect(rXa.name).to.equal('SequelizeValidationError');

      const asPrt = { ...testPlaceData, hostId: host.id, country: 'PRT' };
      const rPrt = await models.Place.create(asPrt).catch((e) => e);
      expect(rPrt).to.be.an('Error');
      expect(rPrt.name).to.equal('SequelizeValidationError');

      const asP = { ...testPlaceData, hostId: host.id, country: 'P' };
      const rP = await models.Place.create(asP).catch((e) => e);
      expect(rP).to.be.an('Error');
      expect(rP.name).to.equal('SequelizeValidationError');
    });
  });
});
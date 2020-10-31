const expect = require('chai').expect;

const { d } = require('../support');
const { decimals } = require('../../lib/mutators/mutators');

describe(d('Mutator: decimals'), () => {
  const options = true;

  it('should return unchanged if options is `false`', async () => {
    const actual = 54.321;
    expect(decimals({ value: actual, options: false })).to.equal(actual);
  });

  it('should return unchanged if value is not finite number', async () => {
    expect(decimals({ value: undefined, options })).to.equal(undefined);
    expect(decimals({ value: null, options })).to.equal(null);
    expect(decimals({ value: Infinity, options })).to.equal(Infinity);
    expect(decimals({ value: NaN, options })).to.be.NaN;
    expect(decimals({ value: true, options })).to.equal(true);
    expect(decimals({ value: false, options })).to.equal(false);
    expect(decimals({ value: '123', options })).to.equal('123');
    const arr = [1, 2, 3];
    expect(decimals({ value: arr, options })).to.equal(arr);

    const pojo = { sequelize: 'airtight' };
    expect(decimals({ value: pojo, options })).to.equal(pojo);

    const date = new Date();
    expect(decimals({ value: date, options })).to.equal(date);

    const set = new Set([1, 2, 3]);
    expect(decimals({ value: set, options })).to.equal(set);

    const map = new Map(Object.entries(pojo));
    expect(decimals({ value: map, options })).to.equal(map);
  });

  it('should round to 2 decimals if decimals is undefined or not finite', async () => {
    expect(decimals({ value: 987.654321 })).to.equal(987.65);
    expect(decimals({ value: 987.0056789, options: null })).to.equal(987.01);
    expect(decimals({ value: 1.005, options: true })).to.equal(1.01);
  });

  it('should round to 2 decimals', async () => {
    expect(decimals({ value: 987.654321, options: 2 })).to.equal(987.65);
    expect(decimals({ value: 987.0056789, options: 2 })).to.equal(987.01);
    expect(decimals({ value: 987.0046789, options: 2 })).to.equal(987);
    expect(decimals({ value: 1.005, options: 2 })).to.equal(1.01);
  });

  it('should round to 3 decimals', async () => {
    expect(decimals({ value: 987.654321, options: 3 })).to.equal(987.654);
    expect(decimals({ value: 987.0056789, options: 3 })).to.equal(987.006);
    expect(decimals({ value: 987.0054789, options: 3 })).to.equal(987.005);
    expect(decimals({ value: 1.005, options: 3 })).to.equal(1.005);
  });

  it('should round to 4 decimals', async () => {
    expect(decimals({ value: 987.654321, options: 4 })).to.equal(987.6543);
    expect(decimals({ value: 987.0056789, options: 4 })).to.equal(987.0057);
    expect(decimals({ value: 987.0056489, options: 4 })).to.equal(987.0056);
    expect(decimals({ value: 1.005, options: 4 })).to.equal(1.005);
  });

  it('should round even if decimals is float (rounds)', async () => {
    expect(decimals({ value: 987.654321, options: 2.4 })).to.equal(987.65);
    expect(decimals({ value: 987.0056789, options: 2.5 })).to.equal(987.006);
    expect(decimals({ value: 987.0056489, options: 3.4 })).to.equal(987.006);
    expect(decimals({ value: 987.0056489, options: 3.5 })).to.equal(987.0056);
    expect(decimals({ value: 1.005, options: 3.5 })).to.equal(1.005);
  });
});

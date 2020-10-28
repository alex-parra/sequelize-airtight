const expect = require('chai').expect;

const { d } = require('../support');
const { trim } = require('../../lib/mutators/mutators');

describe(d('Mutator: trim'), () => {
  const options = true;

  it('should return unchanged if options is not `true`', async () => {
    const actual = 'sequelize';
    expect(trim({ value: ` ${actual}`, options: false })).not.to.equal(actual);
    expect(trim({ value: `${actual} `, options: false })).not.to.equal(actual);

    expect(trim({ value: ` ${actual}`, options: 1 })).not.to.equal(actual);
    expect(trim({ value: `${actual} `, options: 1 })).not.to.equal(actual);

    expect(trim({ value: ` ${actual}`, options: 0 })).not.to.equal(actual);
    expect(trim({ value: `${actual} `, options: 0 })).not.to.equal(actual);

    expect(trim({ value: ` ${actual}`, options: '' })).not.to.equal(actual);
    expect(trim({ value: `${actual} `, options: '' })).not.to.equal(actual);

    expect(trim({ value: ` ${actual}`, options: null })).not.to.equal(actual);
    expect(trim({ value: `${actual} `, options: null })).not.to.equal(actual);

    expect(trim({ value: ` ${actual}` })).not.to.equal(actual);
    expect(trim({ value: `${actual} ` })).not.to.equal(actual);
  });

  it('should return unchanged if value is not `string`', async () => {
    expect(trim({ value: undefined, options })).to.equal(undefined);
    expect(trim({ value: null, options })).to.equal(null);
    expect(trim({ value: 1, options })).to.equal(1);
    expect(trim({ value: 1.2, options })).to.equal(1.2);
    expect(trim({ value: true, options })).to.equal(true);
    expect(trim({ value: false, options })).to.equal(false);
    const arr = [1, 2, 3];
    expect(trim({ value: arr, options })).to.equal(arr);

    const pojo = { sequelize: 'airtight' };
    expect(trim({ value: pojo, options })).to.equal(pojo);

    const date = new Date();
    expect(trim({ value: date, options })).to.equal(date);

    const set = new Set([1, 2, 3]);
    expect(trim({ value: set, options })).to.equal(set);

    const map = new Map(Object.entries(pojo));
    expect(trim({ value: map, options })).to.equal(map);
  });

  it('should trim a leading white-space', async () => {
    const actual = 'airtight';
    expect(trim({ value: ` ${actual}`, options })).to.equal(actual);
    expect(trim({ value: `  ${actual}`, options })).to.equal(actual);
    expect(trim({ value: ` \n${actual}`, options })).to.equal(actual);
    expect(trim({ value: ` \t${actual}`, options })).to.equal(actual);

    expect(trim({ value: `\n${actual}`, options })).to.equal(actual);
    expect(trim({ value: `\n ${actual}`, options })).to.equal(actual);
    expect(trim({ value: `\n\n${actual}`, options })).to.equal(actual);
    expect(trim({ value: `\n\t${actual}`, options })).to.equal(actual);

    expect(trim({ value: `\t${actual}`, options })).to.equal(actual);
    expect(trim({ value: `\t ${actual}`, options })).to.equal(actual);
    expect(trim({ value: `\t\n${actual}`, options })).to.equal(actual);
    expect(trim({ value: `\t\t${actual}`, options })).to.equal(actual);
  });

  it('should trim a trailing white-space', async () => {
    const actual = 'airtight';
    expect(trim({ value: `${actual} `, options })).to.equal(actual);
    expect(trim({ value: `${actual}  `, options })).to.equal(actual);
    expect(trim({ value: `${actual} \n`, options })).to.equal(actual);
    expect(trim({ value: `${actual} \t`, options })).to.equal(actual);

    expect(trim({ value: `${actual}\n`, options })).to.equal(actual);
    expect(trim({ value: `${actual}\n `, options })).to.equal(actual);
    expect(trim({ value: `${actual}\n\n`, options })).to.equal(actual);
    expect(trim({ value: `${actual}\n\t`, options })).to.equal(actual);

    expect(trim({ value: `${actual}\t`, options })).to.equal(actual);
    expect(trim({ value: `${actual}\t `, options })).to.equal(actual);
    expect(trim({ value: `${actual}\t\n`, options })).to.equal(actual);
    expect(trim({ value: `${actual}\t\t`, options })).to.equal(actual);
  });

  it('should trim from both ends', async () => {
    const actual = 'airtight';
    expect(trim({ value: ` \t\n ${actual} \n\t `, options })).to.equal(actual);
  });
});

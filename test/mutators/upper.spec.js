const expect = require('chai').expect;

const { d } = require('../support');
const { upper } = require('../../lib/mutators/mutators');

describe(d('Mutator: upper'), () => {
  const options = true;

  it('should return unchanged if options is not `true`', async () => {
    const actual = 'SEQUELIZE';
    expect(upper({ value: 'SequeLize', options: false })).not.to.equal(actual);
    expect(upper({ value: 'SequeLize', options: 1 })).not.to.equal(actual);
    expect(upper({ value: 'SequeLize', options: 0 })).not.to.equal(actual);
    expect(upper({ value: 'SequeLize', options: '' })).not.to.equal(actual);
    expect(upper({ value: 'SequeLize', options: null })).not.to.equal(actual);
    expect(upper({ value: 'SequeLize' })).not.to.equal(actual);
  });

  it('should return unchanged if value is not `string`', async () => {
    expect(upper({ value: undefined, options })).to.equal(undefined);
    expect(upper({ value: null, options })).to.equal(null);
    expect(upper({ value: 1, options })).to.equal(1);
    expect(upper({ value: 1.2, options })).to.equal(1.2);
    expect(upper({ value: true, options })).to.equal(true);
    expect(upper({ value: false, options })).to.equal(false);
    const arr = [1, 2, 3];
    expect(upper({ value: arr, options })).to.equal(arr);

    const pojo = { sequelize: 'airtight' };
    expect(upper({ value: pojo, options })).to.equal(pojo);

    const date = new Date();
    expect(upper({ value: date, options })).to.equal(date);

    const set = new Set([1, 2, 3]);
    expect(upper({ value: set, options })).to.equal(set);

    const map = new Map(Object.entries(pojo));
    expect(upper({ value: map, options })).to.equal(map);
  });

  it('should uppercase any string', async () => {
    expect(upper({ value: 'Sequelize', options })).to.equal('SEQUELIZE');
    expect(upper({ value: 'SeQuElIzE', options })).to.equal('SEQUELIZE');
    expect(upper({ value: 'SEQUELIZE', options })).to.equal('SEQUELIZE');
  });

  it('should uppercase and preserve white-space', async () => {
    expect(upper({ value: ' SequeLize ', options })).to.equal(' SEQUELIZE ');
  });
});

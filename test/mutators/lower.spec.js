const expect = require('chai').expect;

const { d } = require('../support');
const { lower } = require('../../lib/mutators/mutators');

describe(d('Mutator: lower'), () => {
  const options = true;

  it('should return unchanged if options is not `true`', async () => {
    const actual = 'sequelize';
    expect(lower({ value: 'SequeLize', options: false })).not.to.equal(actual);
    expect(lower({ value: 'SequeLize', options: 1 })).not.to.equal(actual);
    expect(lower({ value: 'SequeLize', options: 0 })).not.to.equal(actual);
    expect(lower({ value: 'SequeLize', options: '' })).not.to.equal(actual);
    expect(lower({ value: 'SequeLize', options: null })).not.to.equal(actual);
    expect(lower({ value: 'SequeLize' })).not.to.equal(actual);
  });

  it('should return unchanged if value is not `string`', async () => {
    expect(lower({ value: undefined, options })).to.equal(undefined);
    expect(lower({ value: null, options })).to.equal(null);
    expect(lower({ value: 1, options })).to.equal(1);
    expect(lower({ value: 1.2, options })).to.equal(1.2);
    expect(lower({ value: true, options })).to.equal(true);
    expect(lower({ value: false, options })).to.equal(false);
    const arr = [1, 2, 3];
    expect(lower({ value: arr, options })).to.equal(arr);

    const pojo = { sequelize: 'airtight' };
    expect(lower({ value: pojo, options })).to.equal(pojo);

    const date = new Date();
    expect(lower({ value: date, options })).to.equal(date);

    const set = new Set([1, 2, 3]);
    expect(lower({ value: set, options })).to.equal(set);

    const map = new Map(Object.entries(pojo));
    expect(lower({ value: map, options })).to.equal(map);
  });

  it('should lowercase any string', async () => {
    expect(lower({ value: 'Sequelize', options })).to.equal('sequelize');
    expect(lower({ value: 'SeQuElIzE', options })).to.equal('sequelize');
    expect(lower({ value: 'SEQUELIZE', options })).to.equal('sequelize');
  });

  it('should lowercase and preserve white-space', async () => {
    expect(lower({ value: ' SequeLize ', options })).to.equal(' sequelize ');
  });
});

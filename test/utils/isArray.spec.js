const { expect } = require('chai');

const { d } = require('../support');
const { isArray } = require('../../lib/utils');

describe(d('Util: isArray'), () => {
  it('should return `false` with non booleans', async () => {
    expect(isArray()).to.be.false;
    expect(isArray(undefined)).to.be.false;
    expect(isArray(null)).to.be.false;
    expect(isArray(true)).to.be.false;
    expect(isArray(false)).to.be.false;
    expect(isArray(Infinity)).to.be.false;
    expect(isArray(NaN)).to.be.false;
    expect(isArray('abcdef')).to.be.false;
    expect(isArray(123)).to.be.false;
    expect(isArray(12.34)).to.be.false;
    expect(isArray(1.2e3)).to.be.false;
    expect(isArray({ num: 123 })).to.be.false;
    expect(isArray(new Set([1, 2, 3]))).to.be.false;
    expect(isArray(new Map(Object.entries({ a: 1, b: 2, c: 3 })))).to.be.false;
  });

  it('should return `true` with `true` and `false`', async () => {
    expect(isArray([])).to.be.true;
    expect(isArray([1, 2, 3])).to.be.true;
    expect(isArray(['a', 'b', 'c'])).to.be.true;
  });
});

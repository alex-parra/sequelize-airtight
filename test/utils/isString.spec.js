const { expect } = require('chai');

const { d } = require('../support');
const { isString } = require('../../lib/utils');

describe(d('Util: isString'), () => {
  it('should return `false` with non strings', async () => {
    expect(isString()).to.be.false;
    expect(isString(undefined)).to.be.false;
    expect(isString(null)).to.be.false;
    expect(isString(true)).to.be.false;
    expect(isString(false)).to.be.false;
    expect(isString(Infinity)).to.be.false;
    expect(isString(NaN)).to.be.false;
    expect(isString(123)).to.be.false;
    expect(isString(12.34)).to.be.false;
    expect(isString(1.2e3)).to.be.false;
    expect(isString([132])).to.be.false;
    expect(isString({ num: 123 })).to.be.false;
  });

  it('should return `true` with strings', async () => {
    expect(isString('abc')).to.be.true;
    expect(isString('100')).to.be.true;
    expect(isString(' ')).to.be.true;
    expect(isString('')).to.be.true;
    expect(isString('\n')).to.be.true;
    expect(isString('\t')).to.be.true;
  });
});

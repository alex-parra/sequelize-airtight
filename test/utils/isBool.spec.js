const { expect } = require('chai');

const { d } = require('../support');
const { isBool } = require('../../lib/utils');

describe(d('Util: isBool'), () => {
  it('should return `false` with non booleans', async () => {
    expect(isBool()).to.be.false;
    expect(isBool(undefined)).to.be.false;
    expect(isBool(null)).to.be.false;
    expect(isBool(Infinity)).to.be.false;
    expect(isBool(NaN)).to.be.false;
    expect(isBool('abcdef')).to.be.false;
    expect(isBool(123)).to.be.false;
    expect(isBool(12.34)).to.be.false;
    expect(isBool(1.2e3)).to.be.false;
    expect(isBool([132])).to.be.false;
    expect(isBool({ num: 123 })).to.be.false;
  });

  it('should return `true` with `true` and `false`', async () => {
    expect(isBool(true)).to.be.true;
    expect(isBool(false)).to.be.true;
  });
});

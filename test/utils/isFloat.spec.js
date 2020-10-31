const { expect } = require('chai');

const { d } = require('../support');
const { isFloat } = require('../../lib/utils');

describe(d('Util: isFloat'), () => {
  it('should return `false` on non floats', async () => {
    expect(isFloat()).to.be.false;
    expect(isFloat(undefined)).to.be.false;
    expect(isFloat(null)).to.be.false;
    expect(isFloat(true)).to.be.false;
    expect(isFloat(false)).to.be.false;
    expect(isFloat('123')).to.be.false;
    expect(isFloat(123)).to.be.false;
    expect(isFloat([132])).to.be.false;
    expect(isFloat({ num: 123 })).to.be.false;
    expect(isFloat(0b100)).to.be.false;
    expect(isFloat(0o100)).to.be.false;
    expect(isFloat(0xaa)).to.be.false;
    expect(isFloat(Infinity)).to.be.false;
    expect(isFloat(NaN)).to.be.false;
  });

  it('should return `true` on floats', async () => {
    expect(isFloat(1.1)).to.be.true;
    expect(isFloat(1.005)).to.be.true;
    expect(isFloat(1.0000001)).to.be.true;
    expect(isFloat(123456789.987654321)).to.be.true;
    expect(isFloat(1 / 3)).to.be.true;
    expect(isFloat(1e-3)).to.be.true;
    expect(isFloat(0b100 / 3)).to.be.true;
  });
});

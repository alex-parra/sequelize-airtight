const { expect } = require('chai');

const { d } = require('../support');
const { isNumber } = require('../../lib/utils');

describe(d('Util: isNumber'), () => {
  it('should return `false` with non numbers', async () => {
    expect(isNumber()).to.be.false;
    expect(isNumber(undefined)).to.be.false;
    expect(isNumber(null)).to.be.false;
    expect(isNumber(true)).to.be.false;
    expect(isNumber(false)).to.be.false;
    expect(isNumber('123')).to.be.false;
    expect(isNumber([132])).to.be.false;
    expect(isNumber({ num: 123 })).to.be.false;
  });

  it('should return `true` on non finite numbers', async () => {
    expect(isNumber(Infinity)).to.be.true;
    expect(isNumber(-Infinity)).to.be.true;
    expect(isNumber(1 / 0)).to.be.true;
    expect(isNumber(NaN)).to.be.true;
    expect(isNumber(12 / 'a')).to.be.true;
  });

  it('should return `true` numbers', async () => {
    expect(isNumber(2)).to.be.true;
    expect(isNumber(4)).to.be.true;
    expect(isNumber(6.3)).to.be.true;
    expect(isNumber(12.4645)).to.be.true;
    expect(isNumber(13 / 2)).to.be.true;
    expect(isNumber(12e2)).to.be.true;
    expect(isNumber(43e-2)).to.be.true;
    expect(isNumber(0b100)).to.be.true;
    expect(isNumber(0b101)).to.be.true;
    expect(isNumber(0x12)).to.be.true;
    expect(isNumber(0xaa)).to.be.true;
    expect(isNumber(0o103)).to.be.true;
    expect(isNumber(0o43)).to.be.true;
  });
});

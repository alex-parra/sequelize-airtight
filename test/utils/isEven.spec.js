const { expect } = require('chai');

const { d } = require('../support');
const { isEven } = require('../../lib/utils');

describe(d('Util: isEven'), () => {
  it('should return `false` with non finite numbers', async () => {
    expect(isEven()).to.be.false;
    expect(isEven(undefined)).to.be.false;
    expect(isEven(null)).to.be.false;
    expect(isEven(true)).to.be.false;
    expect(isEven(false)).to.be.false;
    expect(isEven(Infinity)).to.be.false;
    expect(isEven(NaN)).to.be.false;
    expect(isEven('123')).to.be.false;
    expect(isEven([132])).to.be.false;
    expect(isEven({ num: 123 })).to.be.false;
  });

  it('should return `false` with odd numbers', async () => {
    expect(isEven(1)).to.be.false;
    expect(isEven(3)).to.be.false;
    expect(isEven(5)).to.be.false;
    expect(isEven(7)).to.be.false;
    expect(isEven(15)).to.be.false;
    expect(isEven(33)).to.be.false;
    expect(isEven(2.4)).to.be.false;
    expect(isEven(4.8)).to.be.false;
    expect(isEven(4.01e2)).to.be.false;
    expect(isEven(0b101)).to.be.false;
    expect(isEven(0xab)).to.be.false;
    expect(isEven(0o101)).to.be.false;
  });

  it('should return `true` on even numbers', async () => {
    expect(isEven(2)).to.be.true;
    expect(isEven(4)).to.be.true;
    expect(isEven(6)).to.be.true;
    expect(isEven(12)).to.be.true;
    expect(isEven(24)).to.be.true;
    expect(isEven(48)).to.be.true;
    expect(isEven(0b100)).to.be.true;
    expect(isEven(0o100)).to.be.true;
    expect(isEven(0xaa)).to.be.true;
  });
});

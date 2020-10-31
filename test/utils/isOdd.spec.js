const { expect } = require('chai');

const { d } = require('../support');
const { isOdd } = require('../../lib/utils');

describe(d('Util: isOdd'), () => {
  it('should return `false` with non finite numbers', async () => {
    expect(isOdd()).to.be.false;
    expect(isOdd(undefined)).to.be.false;
    expect(isOdd(null)).to.be.false;
    expect(isOdd(true)).to.be.false;
    expect(isOdd(false)).to.be.false;
    expect(isOdd(Infinity)).to.be.false;
    expect(isOdd(NaN)).to.be.false;
    expect(isOdd('123')).to.be.false;
    expect(isOdd([132])).to.be.false;
    expect(isOdd({ num: 123 })).to.be.false;
  });

  it('should return `false` on even numbers', async () => {
    expect(isOdd(2)).to.be.false;
    expect(isOdd(4)).to.be.false;
    expect(isOdd(6)).to.be.false;
    expect(isOdd(12)).to.be.false;
    expect(isOdd(24)).to.be.false;
    expect(isOdd(0b100)).to.be.false;
    expect(isOdd(0o100)).to.be.false;
    expect(isOdd(0xaa)).to.be.false;
  });

  it('should return `true` with odd numbers', async () => {
    expect(isOdd(1)).to.be.true;
    expect(isOdd(3)).to.be.true;
    expect(isOdd(5)).to.be.true;
    expect(isOdd(7)).to.be.true;
    expect(isOdd(15)).to.be.true;
    expect(isOdd(33)).to.be.true;
    expect(isOdd(2.2)).to.be.true;
    expect(isOdd(2.4)).to.be.true;
    expect(isOdd(4.6)).to.be.true;
    expect(isOdd(4.8)).to.be.true;
    expect(isOdd(0b101)).to.be.true;
    expect(isOdd(0o101)).to.be.true;
    expect(isOdd(0xab)).to.be.true;
  });
});

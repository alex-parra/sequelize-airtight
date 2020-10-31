const { expect } = require('chai');

const { d } = require('../support');
const { isFinite } = require('../../lib/utils');

describe(d('Util: isFinite'), () => {
  it('should return `false` with non numbers', async () => {
    expect(isFinite()).to.be.false;
    expect(isFinite(undefined)).to.be.false;
    expect(isFinite(null)).to.be.false;
    expect(isFinite(true)).to.be.false;
    expect(isFinite(false)).to.be.false;
    expect(isFinite('123')).to.be.false;
    expect(isFinite([132])).to.be.false;
    expect(isFinite({ num: 123 })).to.be.false;
  });

  it('should return `false` on non finite numbers', async () => {
    expect(isFinite(Infinity)).to.be.false;
    expect(isFinite(-Infinity)).to.be.false;
    expect(isFinite(1 / 0)).to.be.false;
    expect(isFinite(NaN)).to.be.false;
    expect(isFinite(12 / 'a')).to.be.false;
  });

  it('should return `true` finite numbers', async () => {
    expect(isFinite(2)).to.be.true;
    expect(isFinite(4)).to.be.true;
    expect(isFinite(6.3)).to.be.true;
    expect(isFinite(12.4645)).to.be.true;
    expect(isFinite(13 / 2)).to.be.true;
    expect(isFinite(12e2)).to.be.true;
    expect(isFinite(43e-2)).to.be.true;
  });
});

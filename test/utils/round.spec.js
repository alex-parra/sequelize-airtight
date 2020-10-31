const { expect } = require('chai');

const { d } = require('../support');
const { round } = require('../../lib/utils');

describe(d('Util: round'), () => {
  it('should return unchanged if value is not float', async () => {
    expect(round(undefined, 2)).to.be.undefined;
    expect(round(null, 2)).to.be.null;
    expect(round(true, 2)).to.be.true;
    expect(round(false, 2)).to.be.false;
    expect(round(0, 2)).to.equal(0);
    expect(round(1, 2)).to.equal(1);
    expect(round(12, 2)).to.equal(12);
    expect(round('12', 2)).to.equal('12');
    expect(round(Infinity, 2)).to.equal(Infinity);
    expect(round(NaN, 2)).to.be.NaN;
  });

  it('should round to decimals specified', async () => {
    expect(round(1.234)).to.equal(1.23);
    expect(round(1.005)).to.equal(1.01);
    expect(round(1.05)).to.equal(1.05);
  });
});

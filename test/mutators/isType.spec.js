const expect = require('chai').expect;

const { d } = require('../support');
const { isType } = require('../../lib/mutators/type-check');

describe(d('Validator: isType'), () => {
  const attrName = 'testing';

  it('should not throw if value is `null` or `undefined`', async () => {
    const d = { options: 'string', attrName };
    expect(() => isType({ ...d })).not.to.throw();
    expect(() => isType({ ...d, value: undefined })).not.to.throw();
    expect(() => isType({ ...d, value: null })).not.to.throw();
  });

  it('should not throw if options is `false`', async () => {
    const d = { options: false, attrName };
    expect(() => isType({ ...d, value: 'hello' })).not.to.throw();
    expect(() => isType({ ...d, value: 1 })).not.to.throw();
    expect(() => isType({ ...d, value: false })).not.to.throw();
  });

  it('should fail if `options` is not `false` or a `string`', async () => {
    const d = { value: 'airtight', attrName };
    expect(() => isType({ ...d, options: 1 })).to.throw(Error);
    expect(() => isType({ ...d, options: true })).to.throw(Error);
    expect(() => isType({ ...d, options: [1, 2, 3] })).to.throw(Error);
    expect(() => isType({ ...d, options: { type: 'string' } })).to.throw(Error);
    expect(() => isType({ ...d, options: 'string' })).not.to.throw(Error);
  });

  it('should fail if a type not supported', async () => {
    const d = { value: 'airtight', attrName };
    expect(() => isType({ ...d, options: 'undefined' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'null' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'array' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'object' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'Date' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'Set' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'Map' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: '' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'struct' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'integer' })).to.throw(TypeError);
    expect(() => isType({ ...d, options: 'float' })).to.throw(TypeError);

    // implemented
    expect(() => isType({ ...d, value: 'hello', options: 'string' })).not.to.throw();
    expect(() => isType({ ...d, value: 123, options: 'number' })).not.to.throw();
    expect(() => isType({ ...d, value: true, options: 'bool' })).not.to.throw();
  });

  it('should fail if options is `string` and value is not', async () => {
    const d = { options: 'string', attrName };
    expect(() => isType({ ...d, value: undefined })).not.to.throw();
    expect(() => isType({ ...d, value: null })).not.to.throw();

    expect(() => isType({ ...d, value: 1 })).to.throw(Error);
    expect(() => isType({ ...d, value: 1.2 })).to.throw(Error);
    expect(() => isType({ ...d, value: true })).to.throw(Error);
    expect(() => isType({ ...d, value: false })).to.throw(Error);
    expect(() => isType({ ...d, value: [1, 2, 3] })).to.throw(Error);
    expect(() => isType({ ...d, value: { hello: 'world' } })).to.throw(Error);
    expect(() => isType({ ...d, value: new Date() })).to.throw(Error);

    expect(() => isType({ ...d, value: '' })).not.to.throw();
  });

  it('should fail if options is `number` and value is not', async () => {
    const d = { options: 'number', attrName };
    expect(() => isType({ ...d, value: undefined })).not.to.throw();
    expect(() => isType({ ...d, value: null })).not.to.throw();

    expect(() => isType({ ...d, value: '' })).to.throw(Error);
    expect(() => isType({ ...d, value: '123' })).to.throw(Error);
    expect(() => isType({ ...d, value: true })).to.throw(Error);
    expect(() => isType({ ...d, value: false })).to.throw(Error);
    expect(() => isType({ ...d, value: [1, 2, 3] })).to.throw(Error);
    expect(() => isType({ ...d, value: { hello: 'world' } })).to.throw(Error);
    expect(() => isType({ ...d, value: new Date() })).to.throw(Error);

    expect(() => isType({ ...d, value: 1 })).not.to.throw();
    expect(() => isType({ ...d, value: 1.2 })).not.to.throw();
  });

  it('should fail if options is `bool` (or `boolean`) and value is not', async () => {
    const d = { options: 'bool', attrName };
    expect(() => isType({ ...d, value: undefined })).not.to.throw();
    expect(() => isType({ ...d, value: null })).not.to.throw();

    expect(() => isType({ ...d, value: '' })).to.throw(Error);
    expect(() => isType({ ...d, value: '1' })).to.throw(Error);
    expect(() => isType({ ...d, value: '0' })).to.throw(Error);
    expect(() => isType({ ...d, value: 'true' })).to.throw(Error);
    expect(() => isType({ ...d, value: 'false' })).to.throw(Error);
    expect(() => isType({ ...d, value: 1 })).to.throw(Error);
    expect(() => isType({ ...d, value: 0 })).to.throw(Error);
    expect(() => isType({ ...d, value: [1, 2, 3] })).to.throw(Error);
    expect(() => isType({ ...d, value: { hello: 'world' } })).to.throw(Error);
    expect(() => isType({ ...d, value: new Date() })).to.throw(Error);

    expect(() => isType({ ...d, value: true })).not.to.throw();
    expect(() => isType({ ...d, value: false })).not.to.throw();
  });
});

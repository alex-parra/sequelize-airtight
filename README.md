# Sequelize Airtight
Make your Sequelize models foolproof with extensive validation checks, setters and getters.

[![NPM version][npm-image]][npm-url]
![Sequelize v6](https://github.com/alex-parra/sequelize-airtight/workflows/Sequelize%20v6/badge.svg)
![Sequelize v5](https://github.com/alex-parra/sequelize-airtight/workflows/Sequelize%20v5/badge.svg)
[![Downloads][downloads-image]][npm-url]

## Why
Sequelize includes builtin validation through [validator.js](https://github.com/validatorjs/validator.js) and while there are several validators available, some are missing which can be implemented with custom validators.  
But doing so in each project is error prone so that's one of the goals of this project.  
Examples:
- ensure a field only accepts `string` or `string` and `Date`, or `number` only.
- ensure a field isn't changed inadvertedly eg. auto-increment `id` should be read-only

And to ensure data is truly consistent, the usefulness of "normalizers" is indisputable and where better than close to the "metal".  
As such, this project also packs `mutators` that allow data to be transformed on `read` and on `write`, ensuring for example:
- that `unique` indexes aren't "fooled" by white-space or case differences
- that all white-space strings aren't considered valid input
- that `number` be set to a `Date` field
- etc...

## Dependencies
Over 160 tests run against:
- Node 10.x, 12.x and 14.x
- Sequelize v5.x and v6.x

## Install
```bash
npm install sequelize-airtight
```

Where you initialize `sequelize`:
```javascript
const airtight = require('sequelize-airtight');
const sequelize = new Sequelize({ ... });

// Init Airtight into sequelize. (must be called before loading models)
airtight.init(sequelize);
```

In each model's attributes:
```javascript
sequelize.define('MyModel', {
  name: {
    type: DataTypes.STRING,
    allowNull: true, // or false
    validate: { ... }, // as always
    airtight: {
      vet: { isType: 'string|Date' }, // these throw ValidationError
      set: { trim: true }, // these run on set, before validation
      get: { upper: true } // these run on get
    }
  }
})
```

The `airtight` property of each field can contain the following:
- `vet` – Validators that throw error if unmet  
  (_verb_ - make a careful and critical examination of something)

- `set` - Mutators that transform the value on setting to `dataValues`

- `get` - Mutators that transform the value when 'read'

---

## Validators
use in `airtight.vet`

### `isType` _since v0.0.1_
```javascript
airtight: { vet: { isType: 'string' } }
```

- Allowed in `vet`
- Throws `SequelizeValidationError` if the value is not one of the specified
- `{isType: 'string'}` - Only allow setting a field to string
- `{isType: 'string|number'}` - only allow setting the field to string or number
- If `value` is null or undefined check is skipped

Types supported:
- `string` _since v0.0.1_
```javascript
airtight: { vet: { isType: 'string' } }
```

- `number` _since v0.2.0_
```javascript
airtight: { vet: { isType: 'number' } }
```

- `bool` _since v0.3.0_ (aliased as `boolean`)
```javascript
airtight: { vet: { isType: 'bool' } }
```

### `readOnly` _TODO_

---

## Mutators
use in `airtight.set` or `airtight.get`

### `trim` _since v0.0.1_
```javascript
airtight: { set: { trim: true } }
```

- Allowed in `set` or `get`
- If set to `true`, trims leading and trailing white-space from strings
- Returns `value` unchanged if it's not a `string`
- If set to `false` returns `value` unchanged
  Ex: `airtight: { set: { trim: false } }`

### `upper` _since v0.5.0_
```javascript
airtight: { set: { upper: true } }
```

- Allowed in `set` or `get`
- If set to `true`, converts string to full uppercase. `SeQuElIzE` >> `SEQUELIZE`
- Returns `value` unchanged if it's not a `string`
- If set to `false` returns `value` unchanged
  Ex: `airtight: { set: { upper: false } }`

### `lower` _since v0.4.0_
```javascript
airtight: { set: { lower: true } }
```

- Allowed in `set` or `get`
- If set to `true`, converts string to full lowercase. `SeQuElIzE` >> `sequelize`
- Returns `value` unchanged if it's not a `string`
- If set to `false` returns `value` unchanged
  Ex: `airtight: { set: { lower: false } }`

### `decimals` _since v0.6.0_
```javascript
airtight: { set: { decimals: 2 } }
```

- Allowed in `set` or `get`
- Values are rounded eg. `12.344` >> `12.34` and `12.345` >> `12.35`
- If set to `true`, rounds value to 2 decimals
- If set to `number`, rounds value to `number` decimals
- Returns `value` unchanged if value is not `float`
- If set to `false` returns `value` unchanged
  Ex: `airtight: { set: { decimals: false } }`

### `ifNull` _TODO_

---

## Contributing
- fork this repo and clone it locally
- run `npm install`
- run `npm test` to run tests agaist the default version of sequelize (v6)
- run `npm test:v5` to run tests agaist sequelize v5.x
- run `npm run build` to compile from TypeScript in `./src` to `JavaScript` in `./lib`

## Credit
Created by [Alex Parra](https://github.com/alex-parra) on Oct 17th, 2020.

---
[npm-url]: https://npmjs.com/package/sequelize-airtight
[npm-image]: http://img.shields.io/npm/v/sequelize-airtight.svg
[downloads-image]: http://img.shields.io/npm/dm/sequelize-airtight.svg

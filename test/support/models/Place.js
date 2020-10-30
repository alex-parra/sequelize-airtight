const { DataTypes } = require('../sequelize');

const attributes = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 255] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: { len: [1] },
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    validate: { isBoolean: true },
  },
  publishedAirtight: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    airtight: {
      vet: { isType: 'bool' },
    },
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { isInt: { min: 1 } },
  },
  maxGuestsAirtight: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { isInt: { min: 1 } },
    airtight: {
      vet: { isType: 'number' },
    },
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isISO31661Alpha2: true, // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    },
  },
  countryAirtight: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isISO31661Alpha2: true, // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    },
    airtight: {
      set: { upper: true },
    },
  },
};

const options = {
  timestamps: true,
};

module.exports = {
  load: (sequelize) => {
    const Place = sequelize.define('Place', attributes, options);
    Place.associate = ({ Host }) => {
      Place.belongsTo(Host, { as: 'Host', foreignKey: { name: 'hostId', allowNull: false }, targetKey: 'id' });
      Host.hasMany(Place, { as: 'Places', sourceKey: 'id', foreignKey: 'hostId' });
    };
    return Place;
  },
};

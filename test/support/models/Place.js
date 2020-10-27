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
  maxGuests: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { isInt: { min: 1 } },
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isISO31661Alpha2: true, // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
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

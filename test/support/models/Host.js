const { DataTypes } = require('sequelize');

const attributes = {
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'User', key: 'id' },
  },
  iban: {
    type: DataTypes.STRING(21),
    allowNull: true,
    validate: { len: [10, 21] },
  },
  taxNumber: {
    type: DataTypes.STRING(11),
    allowNull: true,
    validate: { len: [7, 11] },
  },
};

const options = {
  timestamps: true,
};

module.exports = {
  load: (sequelize) => {
    const Host = sequelize.define('Host', attributes, options);
    Host.associate = ({ User }) => {
      Host.belongsTo(User);
      User.hasOne(Host);
    };
    return Host;
  },
};

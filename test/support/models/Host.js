const { DataTypes } = require('../sequelize');

const attributes = {
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
      Host.belongsTo(User, { as: 'User', foreignKey: { name: 'userId', allowNull: false }, targetKey: 'id' });
      User.hasOne(Host, { as: 'Host', sourceKey: 'id', foreignKey: 'userId' });
    };
    return Host;
  },
};

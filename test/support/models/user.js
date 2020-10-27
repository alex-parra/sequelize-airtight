const { DataTypes } = require('../sequelize');

const attributes = {
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  emailAirtight: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
    validate: { isEmail: true },
    airtight: {
      vet: { isType: 'string' },
      set: { trim: true },
    },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { len: [1, 255] },
  },
  nameAirtight: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { len: [1, 255] },
    airtight: {
      vet: { isType: 'string' },
      set: { trim: true },
    },
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    validate: { isDate: true },
  },
};

const options = {
  timestamps: true,
};

module.exports = {
  load: (sequelize) => {
    const User = sequelize.define('User', attributes, options);
    User.associate = (models) => {
      // pass
    };
    return User;
  },
};

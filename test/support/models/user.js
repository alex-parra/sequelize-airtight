const { DataTypes } = require('sequelize');

const attributes = {
  email: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
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

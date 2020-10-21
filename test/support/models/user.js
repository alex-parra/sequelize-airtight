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

let UserModel;

module.exports = {
  load: (sequelize) => {
    UserModel = sequelize.define('User', attributes, options);
    UserModel.associate = (models) => {
      // pass
    };
    return UserModel;
  },

  UserModel,
};

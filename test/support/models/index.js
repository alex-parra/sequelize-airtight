const { Model } = require('sequelize');

Model.associate = (models) => {};

const user = require('./user');

module.exports = (sequelize) => {
  user.load(sequelize);

  Object.values(sequelize.models).forEach((model) => {
    model.associate(sequelize.models);
  });
};

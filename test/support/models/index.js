const fs = require('fs');
const path = require('path');
const { Model } = require('sequelize');

/**
 * Apply `associate` to base model
 */
Model.associate = (models) => {};

const models = fs.readdirSync(__dirname).reduce((acc, file) => {
  const fileName = path.basename(file, '.js');
  if (['index'].includes(fileName)) return acc;
  return { ...acc, fileName: require(`./${file}`) };
}, {});

module.exports = (sequelize) => {
  Object.values(models).forEach((model) => model.load(sequelize));

  Object.values(sequelize.models).forEach((model) => {
    model.associate(sequelize.models);
  });
};

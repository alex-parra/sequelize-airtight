const fs = require('fs');
const path = require('path');

// Prepare models for loading
const models = fs.readdirSync(__dirname).reduce((acc, file) => {
  const fileName = path.basename(file, '.js');
  if (['index'].includes(fileName)) return acc;
  return { ...acc, fileName: require(`./${file}`) };
}, {});

/**
 * Load models into sequelize and associate them
 */
const loadModels = (sequelize) => {
  // Apply `associate` to base model
  sequelize.Sequelize.Model.associate = (models) => {};

  // Load models into sequelize
  Object.values(models).forEach((model) => model.load(sequelize));

  // Associate now that all models are loaded into sequelize
  Object.values(sequelize.models).forEach((model) => model.associate(sequelize.models));
};

module.exports = (sequelize) => {
  loadModels(sequelize);
};

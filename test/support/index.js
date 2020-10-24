require('dotenv').config();

const DB = require('./db');

const dbConfig = {
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  ...(process.env.DB_HOST && { host: process.env.DB_HOST }),
  ...(process.env.DB_PORT && { port: Number(process.env.DB_PORT) }),
  ...(process.env.DB_LOG && { logging: console.log }),
};

const app = {
  /**
   * The sequelize instance
   */
  db: undefined,

  /**
   * Shortcut to `sequelize.models`
   */
  models: undefined,

  /**
   * Truncate all database tables
   * @returns {Promise} void
   */
  dbReset: async () => app.db.truncate({ cascade: true }),
};

/**
 * Boot up db, et al.
 * @returns {Promise<object>} Object with `{db, models, dbReset}`
 */
const init = async () => {
  if (!app.db) {
    app.db = await DB.init(dbConfig);
    app.models = app.db.models;
  }
  return app;
};

/**
 * Decorate suite titles
 * @param {string} d The title to decorate
 * @returns {string}
 */
const d = (desc) => {
  const length = 50 - (String(desc).length + 3);
  return `_ ${desc} ` + Array.from({ length }, (v, i) => '_').join('');
};

module.exports = {
  d,
  init,
  dbReset: app.dbReset,
};

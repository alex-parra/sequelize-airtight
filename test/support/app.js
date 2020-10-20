require('dotenv').config();

const DB = require('./db');

const options = {
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  ...(process.env.DB_HOST && { host: process.env.DB_HOST }),
  ...(process.env.DB_PORT && { port: Number(process.env.DB_PORT) }),
  ...(process.env.DB_LOG && { logging: console.log }),
};

const app = {
  db: undefined,
  models: undefined,
};

const init = async () => {
  if (!app.db) {
    app.db = await DB.init(options);
    app.models = app.db.models;
  }
  return app;
};

const dbReset = async () => {
  const app = await init();
  await app.db.truncate();
};

module.exports = {
  init,
  dbReset,
};

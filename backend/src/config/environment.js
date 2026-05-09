const path = require('path');

function configureEnvironment() {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const config = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'sigr_db',
  JWT_SECRET: process.env.JWT_SECRET || 'sigr-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
};

module.exports = { configureEnvironment, ...config };

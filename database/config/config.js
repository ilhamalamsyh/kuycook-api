require('dotenv').config();
const pg = require('pg');

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASS,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: 'postgres',
    dialectOptions:{
      ssl:{
        require: true
      }
    },
    use_env_variable: process.env.DEV_DATABASE_URL,
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    dialect: 'postgres',
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASS,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialectModule: pg,
    dialectOptions:{
      ssl:{
        require: true
      }
    },
  },
};

require('dotenv').config({ silent: process.env.NODE_ENV === 'production' })

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASS,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: 'postgres',
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
    use_env_variable: 'postgres://wcmixbdebutfke:803c28e7f16f79661f1847228bf646d30f7b36ee6c822029284fc662ecd3739f@ec2-3-218-171-44.compute-1.amazonaws.com:5432/d998r4f1h3j7fc',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

// process.env.DATABASE_URL

require('dotenv').config();

module.exports = {
  development: {
    port: process.env.DB_PORT,
    jwtSecret: process.env.JWT_SECRET,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      useUTC: false,
    },
    timezone: '-05:00',
  },
};

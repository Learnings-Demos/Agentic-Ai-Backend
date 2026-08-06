const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DIALECT,
  },
};

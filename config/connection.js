const Sequelize = require("sequelize");
require("dotenv").config();

// Set up a Sequelize instance and connect to the database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT || 5432, // Default port for PostgreSQL
    logging: false, // Set to true for SQL query logs in the console (optional)
  }
);

module.exports = sequelize;

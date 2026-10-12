const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.db_HOST,
  user: process.env.db_USER,
  password: process.env.db_PASSWORD,
  database: process.env.db_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
module.exports = db;

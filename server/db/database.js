const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "language_school",
});

const connectDB = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL:", err.message);
      process.exit(1);
    }
    if (connection) connection.release();
    console.log("MySQL connected...");
  });
};

module.exports = { pool, connectDB };

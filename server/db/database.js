const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "language_school",
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log("MySQL connected...");
  } catch (error) {
    console.error("Error connecting to MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };

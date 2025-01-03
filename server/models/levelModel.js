const { pool } = require("../db/database");

const getAllLevels = (callback) => {
  pool.query("SELECT * FROM Poziom_jezyka", (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

const getLevelById = (id, callback) => {
  pool.query(
    "SELECT * FROM Poziom_jezyka WHERE id = ?",
    id,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results[0]);
    }
  );
};

module.exports = {
  getAllLevels,
  getLevelById,
};

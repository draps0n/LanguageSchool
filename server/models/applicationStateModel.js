const { pool } = require("../db/database");

const getAllStates = (callback) => {
  pool.query("SELECT * FROM Status_zgloszenia", (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

const getStateById = (id, callback) => {
  pool.query(
    "SELECT * FROM Status_zgloszenia WHERE id = ?",
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
  getAllStates,
  getStateById,
};

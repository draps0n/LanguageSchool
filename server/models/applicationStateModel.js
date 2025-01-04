const { pool } = require("../db/database");

const getAllStates = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM Status_zgloszenia", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const getStateById = (id, callback) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM Status_zgloszenia WHERE id = ?",
      id,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0]);
      }
    );
  });
};

module.exports = {
  getAllStates,
  getStateById,
};

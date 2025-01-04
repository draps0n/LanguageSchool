const { pool } = require("../db/database");

const getAllLevels = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM Poziom_jezyka", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const getLevelById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM Poziom_jezyka WHERE id = ?",
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
  getAllLevels,
  getLevelById,
};

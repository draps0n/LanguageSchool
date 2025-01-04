const { pool } = require("../db/database");

const getAllRoles = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM rola", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const getRoleById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM rola WHERE id = ?", id, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0]);
    });
  });
};

module.exports = {
  getAllRoles,
  getRoleById,
};

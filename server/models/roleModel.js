const { pool } = require("../db/database");

const getAllRoles = (callback) => {
  pool.query("SELECT * FROM rola", (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

const getRoleById = (id, callback) => {
  pool.query("SELECT * FROM rola WHERE id = ?", id, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results[0]);
  });
};

module.exports = {
  getAllRoles,
  getRoleById,
};

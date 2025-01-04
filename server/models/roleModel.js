const { pool } = require("../db/database");

const getAllRoles = async () => {
  const [results] = await pool.query("SELECT * FROM rola");
  return results;
};

const getRoleById = async (id) => {
  const [results] = await pool.query("SELECT * FROM rola WHERE id = ?", [id]);
  return results[0];
};

module.exports = {
  getAllRoles,
  getRoleById,
};

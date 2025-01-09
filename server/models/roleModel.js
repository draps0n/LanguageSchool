const { pool } = require("../db/database");

const getAllRoles = async () => {
  const [results] = await pool.query("SELECT * FROM rola");
  return results.map((role) => ({
    id: role.id,
    name: role.nazwa,
  }));
};

const getRoleById = async (id) => {
  const [results] = await pool.query("SELECT * FROM rola WHERE id = ?", [id]);

  if (results.length === 0) {
    return null;
  }

  return {
    id: results[0].id,
    name: results[0].nazwa,
  };
};

module.exports = {
  getAllRoles,
  getRoleById,
};

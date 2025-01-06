const { pool } = require("../db/database");

const getAllStates = async () => {
  const [results] = await pool.query("SELECT * FROM Status_zgloszenia");
  return results;
};

const getStateById = async (id) => {
  const [results] = await pool.query(
    "SELECT * FROM Status_zgloszenia WHERE id = ?",
    id
  );
  return results[0];
};

const getStateByName = async (name) => {
  const [results] = await pool.query(
    "SELECT * FROM Status_zgloszenia WHERE nazwa = ?",
    name
  );
  return results[0];
};

module.exports = {
  getAllStates,
  getStateById,
  getStateByName,
};

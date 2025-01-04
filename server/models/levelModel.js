const { pool } = require("../db/database");

const getAllLevels = async () => {
  const [results] = await pool.query("SELECT * FROM Poziom_jezyka");
  return results;
};

const getLevelById = async (id) => {
  const [results] = await pool.query(
    "SELECT * FROM Poziom_jezyka WHERE id = ?",
    [id]
  );
  return results[0];
};

module.exports = {
  getAllLevels,
  getLevelById,
};

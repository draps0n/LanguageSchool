const { pool } = require("../db/database");

const getAllLevels = async () => {
  const [results] = await pool.query("SELECT * FROM Poziom_jezyka");
  return results.map((level) => ({
    id: level.id,
    name: level.nazwa,
    position: level.pozycja,
  }));
};

const getLevelById = async (id) => {
  const [results] = await pool.query(
    "SELECT * FROM Poziom_jezyka WHERE id = ?",
    [id]
  );

  const level = {
    id: results[0].id,
    name: results[0].nazwa,
    position: results[0].pozycja,
  };

  return level;
};

module.exports = {
  getAllLevels,
  getLevelById,
};

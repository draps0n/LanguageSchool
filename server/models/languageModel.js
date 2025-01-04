const { pool } = require("../db/database");

const getAllLanguages = async () => {
  const [results] = await pool.query("SELECT * FROM jezyk");
  return results;
};

const getLanguageById = async (id) => {
  const [results] = await pool.query("SELECT * FROM jezyk WHERE id = ?", [id]);
  return results[0];
};

const createLanguage = async (language) => {
  const [results] = await pool.query(
    "INSERT INTO jezyk (nazwa, skrot) VALUES(?, ?)",
    [language.name, language.code]
  );
  return results;
};

const updateLanguage = async (id, language) => {
  const [results] = await pool.query(
    "UPDATE jezyk SET nazwa = ?, skrot = ? WHERE id = ?",
    [language.name, language.code, id]
  );
  return results;
};

const deleteLanguage = async (id) => {
  const [results] = await pool.query("DELETE FROM jezyk WHERE id = ?", [id]);
  return results;
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};

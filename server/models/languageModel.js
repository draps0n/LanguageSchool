const { pool } = require("../db/database");

const getAllLanguages = async () => {
  const [results] = await pool.query("SELECT * FROM jezyk");
  return results.map((language) => ({
    id: language.id,
    name: language.nazwa,
    code: language.skrot,
  }));
};

const getLanguageById = async (id) => {
  const [results] = await pool.query("SELECT * FROM jezyk WHERE id = ?", [id]);

  if (results.length === 0) {
    return null;
  }

  const language = {
    id: results[0].id,
    name: results[0].nazwa,
    code: results[0].skrot,
  };
  return language;
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

const getTaughtLanguages = async () => {
  const [results] = await pool.query(
    "SELECT * FROM jezyk WHERE jezyk.id IN (SELECT DISTINCT jezyk FROM znajomosc_jezyka)"
  );

  return results.map((language) => ({
    id: language.id,
    name: language.nazwa,
    code: language.skrot,
  }));
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getTaughtLanguages,
};

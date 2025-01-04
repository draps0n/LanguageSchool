const { pool } = require("../db/database");

const getAllLanguages = (callback) => {
  pool.query("SELECT * FROM jezyk", (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

const getLanguageById = (id, callback) => {
  pool.query("SELECT * FROM jezyk WHERE id = ?", id, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results[0]);
  });
};

const createLanguage = (language, callback) => {
  pool.query(
    "INSERT INTO jezyk (nazwa, skrot) VALUES(?, ?)",
    [language.name, language.code],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const updateLanguage = (id, language, callback) => {
  pool.query(
    "UPDATE jezyk SET nazwa = ?, skrot = ? WHERE id = ?",
    [language.name, language.code, id],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const deleteLanguage = (id, callback) => {
  pool.query("DELETE FROM jezyk WHERE id = ?", id, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};

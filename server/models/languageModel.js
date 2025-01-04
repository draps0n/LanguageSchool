const { pool } = require("../db/database");

const getAllLanguages = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM jezyk", (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const getLanguageById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM jezyk WHERE id = ?", id, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0]);
    });
  });
};

const createLanguage = (language) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO jezyk (nazwa, skrot) VALUES(?, ?)",
      [language.name, language.code],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const updateLanguage = (id, language) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE jezyk SET nazwa = ?, skrot = ? WHERE id = ?",
      [language.name, language.code, id],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const deleteLanguage = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM jezyk WHERE id = ?", id, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};

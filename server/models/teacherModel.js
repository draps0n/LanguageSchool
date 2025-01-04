const { pool } = require("../db/database");

const getAllTeachers = (callback) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
      n.przepracowane_godziny, n.stawka_godzinowa
      FROM nauczyciel n
      INNER JOIN uzytkownik u ON n.id = u.id`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getTeacherById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
      n.przepracowane_godziny, n.stawka_godzinowa
      FROM nauczyciel n
      INNER JOIN uzytkownik u ON n.id = u.id
      WHERE u.id = ?`,
      id,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results[0]);
      }
    );
  });
};

const createTeacher = (userId, teacher) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO nauczyciel (id, przepracowane_godziny, stawka_godzinowa) VALUES(?, ?, ?)",
      [userId, teacher.workedHours, teacher.hourRate],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const updateTeacher = (id, teacher) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE nauczyciel SET przepracowane_godziny = ?, stawka_godzinowa = ? WHERE id = ?",
      [teacher.workedHours, teacher.hourRate, id],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const deleteTeacher = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM nauczyciel WHERE id = ?", id, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};

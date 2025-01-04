const { pool } = require("../db/database");

const getAllTeachers = (callback) => {
  pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
    n.przepracowane_godziny, n.stawka_godzinowa
    FROM nauczyciel n
    INNER JOIN uzytkownik u ON n.id = u.id`,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const getTeacherById = (id, callback) => {
  pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
    n.przepracowane_godziny, n.stawka_godzinowa
    FROM nauczyciel n
    INNER JOIN uzytkownik u ON n.id = u.id
    WHERE u.id = ?`,
    id,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results[0]);
    }
  );
};

const createTeacher = (userId, teacher, callback) => {
  pool.query(
    "INSERT INTO nauczyciel (id, przepracowane_godziny, stawka_godzinowa) VALUES(?, ?, ?)",
    [userId, teacher.workedHours, teacher.hourRate],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const updateTeacher = (id, teacher, callback) => {
  pool.query(
    "UPDATE nauczyciel SET przepracowane_godziny = ?, stawka_godzinowa = ? WHERE id = ?",
    [teacher.workedHours, teacher.hourRate, id],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const deleteTeacher = (id, callback) => {
  pool.query("DELETE FROM nauczyciel WHERE id = ?", id, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};

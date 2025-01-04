const { pool } = require("../db/database");

const getAllStudents = (callback) => {
  pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
    s.czy_rabat, s.opis
    FROM student s
    INNER JOIN uzytkownik u ON s.id = u.id`,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const getStudentById = (id, callback) => {
  pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
    s.czy_rabat, s.opis
    FROM student s
    INNER JOIN uzytkownik u ON s.id = u.id
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

const createStudent = (userId, student, callback) => {
  pool.query(
    "INSERT INTO student (id, czy_rabat, opis) VALUES(?, ?, ?)",
    [userId, student.discount, student.description],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const updateStudent = (id, student, callback) => {
  pool.query(
    "UPDATE student SET czy_rabat = ?, opis = ? WHERE id = ?",
    [student.discount, student.description, id],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const deleteStudent = (id, callback) => {
  pool.query("DELETE FROM student WHERE id = ?", id, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

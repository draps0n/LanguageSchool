const { pool } = require("../db/database");

const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
      s.czy_rabat, s.opis
      FROM student s
      INNER JOIN uzytkownik u ON s.id = u.id`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getStudentById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
      s.czy_rabat, s.opis
      FROM student s
      INNER JOIN uzytkownik u ON s.id = u.id
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

const createStudent = (userId, student) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO student (id, czy_rabat, opis) VALUES(?, ?, ?)",
      [userId, student.discount, student.description],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const updateStudent = (id, student) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE student SET czy_rabat = ?, opis = ? WHERE id = ?",
      [student.discount, student.description, id],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const deleteStudent = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM student WHERE id = ?", id, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

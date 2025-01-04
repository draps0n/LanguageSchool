const { pool } = require("../db/database");

const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
      k.czy_rabat, k.opis
      FROM kursant k
      INNER JOIN uzytkownik u ON k.id = u.id`,
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
      k.czy_rabat, k.opis
      FROM kursant k
      INNER JOIN uzytkownik u ON k.id = u.id
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

const createStudent = (userId, student, connection) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO kursant (id, czy_rabat, opis) VALUES(?, 'n', ?)",
      [userId, student.description],
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
      "UPDATE kursant SET czy_rabat = ?, opis = ? WHERE id = ?",
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
    pool.query("DELETE FROM kursant WHERE id = ?", id, (error, results) => {
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

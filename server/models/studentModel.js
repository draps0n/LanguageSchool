const { pool } = require("../db/database");

const getAllStudents = async () => {
  const [results] = await pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
      k.czy_rabat, k.opis
      FROM kursant k
      INNER JOIN uzytkownik u ON k.id = u.id`
  );
  return results;
};

const getStudentById = async (id) => {
  const [results] = await pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
    k.czy_rabat, k.opis
    FROM kursant k
    INNER JOIN uzytkownik u ON k.id = u.id
    WHERE u.id = ?`,
    [id]
  );
  return results[0];
};

const createStudent = async (userId, student, connection) => {
  const [results] = await connection.query(
    "INSERT INTO kursant (id, czy_rabat, opis) VALUES(?, 'n', ?)",
    [userId, student.description]
  );
  return results;
};

const updateStudent = async (id, student, connection) => {
  const [results] = await connection.connection(
    "UPDATE kursant SET czy_rabat = ?, opis = ? WHERE id = ?",
    [student.discount, student.description, id]
  );
  return results;
};

const deleteStudent = async (id, connection) => {
  const [results] = await connection.query("DELETE FROM kursant WHERE id = ?", [
    id,
  ]);
  return results;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

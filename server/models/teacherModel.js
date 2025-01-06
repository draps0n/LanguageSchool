const { pool } = require("../db/database");

const getAllTeachers = async (callback) => {
  const [results] = await pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
    n.przepracowane_godziny, n.stawka_godzinowa
    FROM nauczyciel n
    INNER JOIN uzytkownik u ON n.id = u.id`
  );

  return results.map((teacher) => {
    return {
      id: teacher.id,
      name: teacher.imie,
      lastName: teacher.nazwisko,
      email: teacher.email,
      birthDate: teacher.data_urodzenia,
      workedHours: teacher.przepracowane_godziny,
      hourRate: teacher.stawka_godzinowa,
    };
  });
};

const getTeacherById = async (id) => {
  const [results] = await pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia,
    n.przepracowane_godziny, n.stawka_godzinowa
    FROM nauczyciel n
    INNER JOIN uzytkownik u ON n.id = u.id
    WHERE u.id = ?`,
    [id]
  );
  return results[0];
};

const createTeacher = async (userId, teacher) => {
  const [results] = await pool.query(
    "INSERT INTO nauczyciel (id, przepracowane_godziny, stawka_godzinowa) VALUES(?, ?, ?)",
    [userId, teacher.workedHours, teacher.hourRate]
  );
  return results;
};

const updateTeacher = async (id, teacher) => {
  const [results] = await pool.query(
    "UPDATE nauczyciel SET przepracowane_godziny = ?, stawka_godzinowa = ? WHERE id = ?",
    [teacher.workedHours, teacher.hourRate, id]
  );
  return results;
};

const deleteTeacher = async (id) => {
  const [results] = await pool.query("DELETE FROM nauczyciel WHERE id = ?", [
    id,
  ]);
  return results;
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};

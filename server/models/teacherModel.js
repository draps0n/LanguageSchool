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

const createTeacher = async (userId, teacher, connection) => {
  const [results] = await connection.query(
    "INSERT INTO nauczyciel (id, przepracowane_godziny, stawka_godzinowa) VALUES(?, ?, ?)",
    [userId, teacher.hoursWorked, teacher.hourlyRate]
  );
  return results;
};

const updateTeacher = async (id, teacher) => {
  const [results] = await pool.query(
    "UPDATE nauczyciel SET przepracowane_godziny = ?, stawka_godzinowa = ? WHERE id = ?",
    [teacher.hoursWorked, teacher.hourlyRate, id]
  );
  return results;
};

const deleteTeacher = async (id, connection) => {
  const [results] = await connection.query(
    "DELETE FROM nauczyciel WHERE id = ?",
    [id]
  );
  return results;
};

const getTeacherLanguages = async (id) => {
  const [results] = await pool.query(
    `SELECT j.id, j.nazwa, j.skrot
    FROM jezyk j
    INNER JOIN nauczyciel_jezyk nj ON j.id = nj.id_jezyk
    WHERE nj.id_nauczyciel = ?`,
    [id]
  );
  return results.map((language) => {
    return {
      id: language.id,
      name: language.nazwa,
      code: language.skrot,
    };
  });
};

const deleteAllTeacherKnownLanguages = async (id, connection) => {
  const [results] = await connection.query(
    "DELETE FROM znajomosc_jezyka WHERE nauczyciel = ?",
    [id]
  );
  return results;
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherLanguages,
  deleteAllTeacherKnownLanguages,
};

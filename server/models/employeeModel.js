const { pool } = require("../db/database");

const getAllEmployees = async () => {
  const [results] = await pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia, p.pensja
      FROM pracownik_administracyjny p
      INNER JOIN uzytkownik u ON p.id = u.id`
  );
  return results;
};

const getEmployeeById = async (id) => {
  const [results] = await pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia, p.pensja
    FROM pracownik_administracyjny p
    INNER JOIN uzytkownik u ON p.id = u.id
    WHERE u.id = ?`,
    [id]
  );
  return results[0];
};

const createEmployee = async (userId, employee) => {
  const [results] = await pool.query(
    "INSERT INTO pracownik_administracyjny (id, pensja) VALUES(?, ?)",
    [userId, employee.salary]
  );
  return results;
};

const updateEmployee = async (id, salary, connection) => {
  const con = connection === undefined ? pool : connection;

  const [results] = await con.query(
    "UPDATE pracownik_administracyjny SET pensja = ? WHERE id = ?",
    [salary, id]
  );
  return results;
};

const deleteEmployee = async (id, connection) => {
  const [results] = await connection.query(
    "DELETE FROM pracownik_administracyjny WHERE id = ?",
    [id]
  );
  return results;
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

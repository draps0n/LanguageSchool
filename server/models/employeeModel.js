const { pool } = require("../db/database");

const getAllEmployees = (callback) => {
  pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia, p.pensja
    FROM pracownik_administracyjny p
    INNER JOIN uzytkownik u ON p.id = u.id`,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const getEmployeeById = (id, callback) => {
  pool.query(
    `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia, p.pensja
    FROM pracownik_administracyjny p
    INNER JOIN uzytkownik u ON p.id = u.id
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

const createEmployee = (userId, employee, callback) => {
  pool.query(
    "INSERT INTO pracownik_administracyjny (id, pensja) VALUES(?, ?)",
    [userId, employee.salary],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const updateEmployee = (id, employee, callback) => {
  pool.query(
    "UPDATE pracownik_administracyjny SET pensja = ? WHERE id = ?",
    [employee.salary, id],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

const deleteEmployee = (id, callback) => {
  pool.query(
    "DELETE FROM pracownik_administracyjny WHERE id = ?",
    id,
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    }
  );
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

const { pool } = require("../db/database");

const getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia, p.pensja
      FROM pracownik_administracyjny p
      INNER JOIN uzytkownik u ON p.id = u.id`,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const getEmployeeById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT u.id, u.imie, u.nazwisko, u.email, u.data_urodzenia, p.pensja
      FROM pracownik_administracyjny p
      INNER JOIN uzytkownik u ON p.id = u.id
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

const createEmployee = (userId, employee) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO pracownik_administracyjny (id, pensja) VALUES(?, ?)",
      [userId, employee.salary],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const updateEmployee = (id, employee) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE pracownik_administracyjny SET pensja = ? WHERE id = ?",
      [employee.salary, id],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

const deleteEmployee = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM pracownik_administracyjny WHERE id = ?",
      id,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

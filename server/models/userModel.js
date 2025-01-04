const { pool } = require("../db/database");

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM uzytkownik WHERE email = ?`,
      email,
      (error, results) => {
        if (error) {
          return reject(error);
        }

        if (results.length === 0) {
          return resolve(null);
        }

        user = {
          id: results[0].id,
          name: results[0].imie,
          lastName: results[0].nazwisko,
          email: results[0].email,
          dateOfBirth: results[0].data_urodzenia,
          password: results[0].haslo,
          refreshToken: results[0].refresh_token,
          role: results[0].rola,
        };
        resolve(user);
      }
    );
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM uzytkownik WHERE id = ?`,
      id,
      (error, results) => {
        if (error) {
          return reject(error);
        }

        if (results.length === 0) {
          return resolve(null);
        }

        user = {
          id: results[0].id,
          name: results[0].imie,
          lastName: results[0].nazwisko,
          email: results[0].email,
          dateOfBirth: results[0].data_urodzenia,
          password: results[0].haslo,
          refreshToken: results[0].refresh_token,
          role: results[0].rola,
        };
        resolve(user);
      }
    );
  });
};

const createUser = (user, roleId, connection) => {
  return new Promise((resolve, reject) => {
    const { name, lastName, email, dateOfBirth, password } = user;

    console.log(user);

    const insertUserQuery = `
      INSERT INTO uzytkownik (imie, nazwisko, email, data_urodzenia, haslo, refresh_token, rola)
      VALUES (?, ?, ?, ?, ?, '', ?)
    `;

    connection.query(
      insertUserQuery,
      [name, lastName, email, dateOfBirth, password, roleId],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results.insertId);
      }
    );
  });
};

const updateUserRefreshToken = (userId, refreshToken) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE uzytkownik SET refresh_token = ? WHERE id = ?",
      [refreshToken, userId],
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
  getUserByEmail,
  getUserById,
  createUser,
  updateUserRefreshToken,
};

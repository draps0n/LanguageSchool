const { pool } = require("../db/database");

const getUserByEmail = (email, callback) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM uzytkownik WHERE email = ?`,
      email,
      (error, results) => {
        if (error) {
          return reject(error);
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

const getUserById = (id, callback) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM uzytkownik WHERE id = ?`,
      id,
      (error, results) => {
        if (error) {
          return reject(error);
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

const createUser = (user, callback) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      lastName,
      email,
      dateOfBirth,
      password,
      refreshToken,
      role,
      description,
    } = user;

    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject(err);
        }

        const insertUserQuery = `
          INSERT INTO uzytkownik (imie, nazwisko, email, data_urodzenia, haslo, refresh_token, rola)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(
          insertUserQuery,
          [name, lastName, email, dateOfBirth, password, refreshToken, role],
          (error, results) => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                reject(error);
              });
            }

            const userId = results.insertId;

            const insertStudentQuery = `
              INSERT INTO kursant (id, czy_rabat, opis)
              VALUES (?, 'n', ?)
            `;

            connection.query(
              insertStudentQuery,
              [userId, description],
              (error, results) => {
                if (error) {
                  return connection.rollback(() => {
                    connection.release();
                    reject(error);
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      reject(err);
                    });
                  }

                  connection.release();
                  resolve(userId);
                });
              }
            );
          }
        );
      });
    });
  });
};

const updateUserRefreshToken = (userId, refreshToken, callback) => {
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

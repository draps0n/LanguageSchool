const { pool } = require("../db/database");

const getAllUsers = async () => {
  const [results] = await pool.query("SELECT * FROM uzytkownik");
  return results;
};

const getUserByEmail = async (email) => {
  const [results] = await pool.query(
    "SELECT * FROM uzytkownik WHERE email = ?",
    [email]
  );
  if (results.length === 0) {
    return null;
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

  return user;
};

const getUserById = async (id) => {
  const [results] = await pool.query("SELECT * FROM uzytkownik WHERE id = ?", [
    id,
  ]);
  if (results.length === 0) {
    return null;
  }
  const user = {
    id: results[0].id,
    name: results[0].imie,
    lastName: results[0].nazwisko,
    email: results[0].email,
    dateOfBirth: results[0].data_urodzenia,
    password: results[0].haslo,
    refreshToken: results[0].refresh_token,
    role: results[0].rola,
  };
  return user;
};

const createUser = async (user, roleId, connection) => {
  const { name, lastName, email, dateOfBirth, password } = user;

  const insertUserQuery = `
    INSERT INTO uzytkownik (imie, nazwisko, email, data_urodzenia, haslo, refresh_token, rola)
    VALUES (?, ?, ?, ?, ?, '', ?)
  `;
  const [results] = await connection.query(insertUserQuery, [
    name,
    lastName,
    email,
    dateOfBirth,
    password,
    roleId,
  ]);

  return results.insertId;
};

const updateUserRefreshToken = async (userId, refreshToken) => {
  const [results] = await pool.query(
    "UPDATE uzytkownik SET refresh_token = ? WHERE id = ?",
    [refreshToken, userId]
  );
  return results;
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  updateUserRefreshToken,
};

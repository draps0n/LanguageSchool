const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db/database");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;

  // Sprawdzenie czy email i hasło zostały przesłane
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Sprawdzenie poprawności formatu emaila
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  try {
    // Sprawdzenie czy użytkownik istnieje
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Sprawdzenie czy hasło jest poprawne
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }

    // Generowanie access i refresh tokenu
    const accessToken = jwt.sign(
      { userData: { userId: user.id, roleId: user.role } },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Zapisanie refresh tokenu w bazie danych
    await userModel.updateUserRefreshToken(user.id, refreshToken);

    // Ustawienie refresh token jako httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    // Wysłanie access tokenu  i danych użytkownika
    res.status(200).send({
      accessToken,
      userData: {
        userId: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const register = async (req, res) => {
  const user = req.body;

  // Sprawdzenie czy wszystkie pola zostały przesłane
  if (
    !user.name ||
    !user.lastName ||
    !user.email ||
    !user.dateOfBirth ||
    !user.password ||
    !user.description
  ) {
    return res.status(400).send("All fields are required");
  }

  // Sprawdzenie poprawności danych
  if (user.name.length < 2 || user.name.length > 50) {
    return res.status(400).send("Name must be between 2 and 50 characters");
  }

  if (user.lastName.length < 2 || user.lastName.length > 50) {
    return res
      .status(400)
      .send("Last name must be between 2 and 50 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return res.status(400).send("Invalid email format");
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(user.dateOfBirth)) {
    return res.status(400).send("Date must be in YYYY-MM-DD format");
  }

  const birthDate = new Date(user.dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  if (age < 18) {
    return res.status(400).send("User must be at least 18 years old");
  }

  if (user.description.length < 10 || user.description.length > 200) {
    return res
      .status(400)
      .send("Description must be between 10 and 200 characters");
  }

  // Sprawdzenie czy użytkownik o podanym emailu już istnieje
  try {
    const userExists = await userModel.getUserByEmail(user.email);
    if (userExists) {
      return res.status(400).send("User with this email already exists");
    }

    // Zahasowanie hasła
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    // Stworzenie nowego użytkownika i studenta
    const connection = await pool.getConnection();
    try {
      // Rozpoczęcie transakcji
      await connection.beginTransaction();

      const userId = await userModel.createUser(user, 2, connection);
      await studentModel.createStudent(userId, user, connection);

      // Zakończenie transakcji
      await connection.commit();
      res.sendStatus(201);
    } catch (error) {
      await connection.rollback();
      console.log(error);
      return res.status(500).send("Internal server error");
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

const handleRefreshToken = async (req, res) => {
  // Sprawdzenie czy refreshToken znajduje się w ciasteczku
  const cookies = req.cookies;
  if (!cookies || !cookies.refreshToken) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.refreshToken;

  // Sprawdzenie czy refreshToken jest poprawny
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;

    // Sprawdzenie czy użytkownik istnieje i czy refreshToken jest zgodny z tym w bazie danych
    const fetchedUser = await userModel.getUserById(userId);
    if (!fetchedUser || fetchedUser.refreshToken !== refreshToken) {
      // Usunięcie refreshToken z cookie, jeśli jest niepoprawny
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(403);
    }

    // Generowanie nowego access tokenu
    const accessToken = jwt.sign(
      { userData: { userId: fetchedUser.id, roleId: fetchedUser.role } },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).send({ accessToken });
  } catch (error) {
    return res.status(401).send("Invalid refresh token");
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.refreshToken) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.refreshToken;

  try {
    // Sprawdzenie czy użytkownik istnieje i czy refreshToken jest zgodny z tym w bazie danych
    const fetchedUser = await userModel.getUserByRefreshToken(refreshToken);
    if (!fetchedUser) {
      // Usunięcie refreshToken z cookie, jeśli jest niepoprawny
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(401).send("Invalid refresh token");
    }

    // Usunięcie refreshToken z bazy danych
    await userModel.updateUserRefreshToken(fetchedUser.id, "");

    // Usunięcie refreshToken z cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.sendStatus(200);
  } catch (error) {
    return res.status(401).send("Invalid refresh token");
  }
};

module.exports = {
  login,
  register,
  handleRefreshToken,
  logout,
};

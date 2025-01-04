const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db/database");
require("dotenv").config();

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await userModel.updateUserRefreshToken(user.id, refreshToken);

    res.status(200).send({ token, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const register = async (req, res) => {
  const user = req.body;

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

  try {
    const userExists = await userModel.getUserByEmail(user.email);
    if (userExists) {
      return res.status(400).send("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  } catch (error) {
    return res.status(500).send("Internal server error");
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal server error");
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        console.log(err);
        connection.release();
        return res.status(500).send("Internal server error");
      }

      try {
        const userId = await userModel.createUser(user, 2, connection);
        await studentModel.createStudent(userId, user, connection);

        connection.commit(async (err) => {
          if (err) {
            console.log(err);
            connection.rollback(() => {
              connection.release();
              return res.status(500).send("Internal server error");
            });
          }

          connection.release();

          const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "15m",
          });
          const refreshToken = jwt.sign(
            { userId },
            process.env.JWT_REFRESH_SECRET,
            {
              expiresIn: "1d",
            }
          );

          await userModel.updateUserRefreshToken(userId, refreshToken);

          res.status(201).send({ token, refreshToken });
        });
      } catch (error) {
        console.log(error);
        connection.rollback(() => {
          connection.release();
          return res.status(500).send("Internal server error");
        });
      }
    });
  });
};

const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).send("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;
    const user = await userModel.getUserById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).send("Invalid refresh token");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await userModel.updateUserRefreshToken(user.id, newRefreshToken);

    res.status(200).send({ token, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  login,
  register,
  handleRefreshToken,
};

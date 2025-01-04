const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  const { name, lastName, email, dateOfBirth, password, description } =
    req.body;

  console.log(req.body);

  if (
    !name ||
    !lastName ||
    !email ||
    !dateOfBirth ||
    !password ||
    !description
  ) {
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await userModel.getUserByEmail(email);
    if (user) {
      return res.status(409).send("Email is registered already");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      lastName,
      email,
      dateOfBirth,
      password: hashedPassword,
      refreshToken: "",
      role: 2,
      description,
    };

    const userId = await userModel.createUser(newUser);

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "1d",
    });

    await userModel.updateUserRefreshToken(userId, refreshToken);

    res.status(201).send({ token, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
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
    if (!user || user.refresh_token !== refreshToken) {
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

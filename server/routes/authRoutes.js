const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router
  .post("/login", authController.login)
  .post("/register", authController.register);

router
  .get("/refresh", authController.handleRefreshToken)
  .get("/logout", authController.logout);

module.exports = router;

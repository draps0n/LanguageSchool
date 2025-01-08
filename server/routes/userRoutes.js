const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

router
  .get("/", userController.getAllUsers)
  .get("/profile", userController.getUserById)
  .put("/profile", userController.updateUser);

module.exports = router;

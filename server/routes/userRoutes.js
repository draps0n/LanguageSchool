const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

router
  .get("/user", userController.getUserById)
  .put("/user", userController.updateUser);

module.exports = router;

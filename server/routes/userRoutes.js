const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const verifyRole = require("../middlewares/verifyRoleMiddleware.js");
const { getRoles } = require("../config/roles.js");

router
  .get("/profile", userController.getUserProfileDetails)
  .delete("/profile", userController.deleteUserProfile)
  .put("/profile", userController.updateUser)
  .get(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    userController.getUserDetails
  )
  .delete(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    userController.deleteUserById
  )
  .put(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    userController.updateUserById
  )
  .get(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    userController.getAllUsers
  )
  .post(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    userController.registerUserByAdmin
  );

module.exports = router;

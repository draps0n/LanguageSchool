const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    roleController.getAllRoles
  )
  .get(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    roleController.getRoleById
  );

module.exports = router;

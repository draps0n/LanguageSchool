const express = require("express");
const router = express.Router();
const applicationStateController = require("../controllers/applicationStateController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router.get(
  "/",
  verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
  applicationStateController.getAllStates
);

router.get(
  "/:id",
  verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
  applicationStateController.getStateById
);

module.exports = router;

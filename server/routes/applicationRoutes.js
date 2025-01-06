const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .post(
    "/",
    verifyRole(getRoles().STUDENT),
    applicationController.addNewApplication
  )
  .delete(
    "/:id",
    verifyRole(getRoles().STUDENT, getRoles().PRACOWNIK_ADMINISTRACYJNY),
    applicationController.deleteApplication
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .post(
    "/",
    verifyRole(getRoles().KURSANT),
    applicationController.addNewApplication
  )
  .delete(
    "/:id",
    verifyRole(getRoles().KURSANT),
    applicationController.deleteApplication
  )
  .get(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    applicationController.getAllApplications
  )
  .get(
    "/user",
    verifyRole(getRoles().KURSANT),
    applicationController.getApplicationsForUser
  )
  .put(
    "/:id",
    verifyRole(getRoles().KURSANT),
    applicationController.updateApplicationByUser
  )
  .put(
    "/:id/review",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    applicationController.reviewApplication
  )
  .get(
    "/:id",
    verifyRole(getRoles().KURSANT),
    applicationController.getApplicationEditableData
  );

module.exports = router;

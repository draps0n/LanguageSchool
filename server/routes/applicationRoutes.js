const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get("/group/:id/user", applicationController.getApplicationsForUserToGroup)
  .get("/group/:id", applicationController.getApplicationsForGroup)
  .get(
    "/user",
    verifyRole(getRoles().KURSANT),
    applicationController.getApplicationsForUser
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
  )
  .put(
    "/:id",
    verifyRole(getRoles().KURSANT),
    applicationController.updateApplicationByUser
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
  .post(
    "/",
    verifyRole(getRoles().KURSANT),
    applicationController.addNewApplication
  );

module.exports = router;

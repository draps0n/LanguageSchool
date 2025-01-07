const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get("/", teacherController.getAllTeachers)
  .get(
    "/:id/languages",
    verifyRole(getRoles.NAUCZYCIEL, getRoles.PRACOWNIK_ADMINISTRACYJNY),
    teacherController.getTeacherLanguages
  );

module.exports = router;

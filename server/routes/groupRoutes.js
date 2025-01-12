const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .put(
    "/:groupId/students/:studentId/absences",
    verifyRole(getRoles().NAUCZYCIEL),
    groupController.updateAbsences
  )
  .delete(
    "/:groupId/students/:studentId",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.deleteStudentFromGroup
  )
  .get(
    "/available",
    verifyRole(getRoles().KURSANT),
    groupController.getAvailableGroupsForUser
  )
  .get("/user", verifyRole(getRoles().KURSANT), groupController.getUserGroups)
  .get(
    "/teacher",
    verifyRole(getRoles().NAUCZYCIEL),
    groupController.getTeacherGroups
  )
  .get(
    "/:id/students",
    verifyRole(getRoles().NAUCZYCIEL, getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.getGroupStudents
  )
  .delete(
    "/:id/leave",
    verifyRole(getRoles().KURSANT),
    groupController.leaveGroup
  )
  .get("/:id", groupController.getGroupById)
  .delete(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.deleteGroup
  )
  .put(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.updateGroup
  )
  .get("/", groupController.getAllGroups)
  .post(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.createGroup
  );

module.exports = router;

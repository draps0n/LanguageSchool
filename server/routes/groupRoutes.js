const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get("/available", groupController.getAvailableGroupsForUser)
  .get("/user", verifyRole(getRoles().KURSANT), groupController.getUserGroups)
  .get(
    "/teacher",
    verifyRole(getRoles().NAUCZYCIEL),
    groupController.getTeacherGroups
  )
  .delete(
    "/:groupId/students/:studentId",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.deleteStudentFromGroup
  )
  .get("/:id/students", groupController.getGroupStudents)
  .delete("/:id/leave", groupController.leaveGroup)
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

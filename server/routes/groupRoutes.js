const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get("/", groupController.getAllGroups)
  .get("/:id", groupController.getGroupById)
  .delete(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.deleteGroup
  )
  .post(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.createGroup
  )
  .put(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    groupController.updateGroup
  );

module.exports = router;

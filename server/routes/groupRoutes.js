const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router
  .get("/", groupController.getAllGroups)
  .get("/:id", groupController.getGroupById)
  .delete("/:id", groupController.deleteGroup);

module.exports = router;

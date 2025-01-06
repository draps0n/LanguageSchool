const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router
  .post("/", applicationController.addNewApplication)
  .delete("/:id", applicationController.deleteApplicationById);

module.exports = router;

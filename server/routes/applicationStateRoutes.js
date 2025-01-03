const express = require("express");
const router = express.Router();
const applicationStateController = require("../controllers/applicationStateController");

router.get("/", applicationStateController.getAllStates);

router.get("/:id", applicationStateController.getStateById);

module.exports = router;

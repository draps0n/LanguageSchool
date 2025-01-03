const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");

router
  .get("/", languageController.getLanguages)
  .post("/", languageController.createLanguage);

router
  .get("/:id", languageController.getLanguageById)
  .put("/:id", languageController.updateLanguage);

module.exports = router;

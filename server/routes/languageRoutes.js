const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get("/taught", languageController.getTaughtLanguages)
  .get("/:id", languageController.getLanguageById)
  .put(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    languageController.updateLanguage
  )
  .get("/", languageController.getLanguages)
  .post(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    languageController.createLanguage
  );

module.exports = router;

const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const { getRoles } = require("../config/roles");

router
  .get("/", languageController.getLanguages)
  .get("/:id", languageController.getLanguageById)
  .post(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    languageController.createLanguage
  )
  .put(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    languageController.updateLanguage
  );

module.exports = router;

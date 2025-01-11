const express = require("express");
const router = express.Router();
const languageController = require("../controllers/languageController");
const verifyRole = require("../middlewares/verifyRoleMiddleware");
const verifyJWT = require("../middlewares/verifyJWTMiddleware");
const { getRoles } = require("../config/roles");

router.get("/", languageController.getLanguages);

router.use(verifyJWT);

router
  .get("/taught", languageController.getTaughtLanguages)
  .get("/:id", languageController.getLanguageById)
  .put(
    "/:id",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    languageController.updateLanguage
  )
  .post(
    "/",
    verifyRole(getRoles().PRACOWNIK_ADMINISTRACYJNY),
    languageController.createLanguage
  );

module.exports = router;

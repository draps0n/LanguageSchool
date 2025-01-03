const languageModel = require("../models/languageModel");

const getLanguages = (req, res) => {
  languageModel.getAllLanguages((error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).json(results);
  });
};

const getLanguageById = (req, res) => {
  const id = req.params.id;
  languageModel.getLanguageById(id, (error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }

    if (!results) {
      return res.status(404).send("Language not found");
    }

    res.status(200).json(results);
  });
};

const createLanguage = (req, res) => {
  const language = req.body;

  if (!language.name || !language.code) {
    return res.status(400).send("Please provide all required fields");
  }

  languageModel.createLanguage(language, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
    res.status(201).send("Language created successfully");
  });
};

const updateLanguage = (req, res) => {
  const id = req.params.id;
  const language = req.body;

  if (!language.name || !language.code) {
    return res.status(400).send("Please provide all required fields");
  }

  languageModel.updateLanguage(id, language, (error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).send("Language updated successfully");
  });
};

module.exports = {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
};

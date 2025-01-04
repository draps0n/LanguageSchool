const languageModel = require("../models/languageModel");

const getLanguages = async (req, res) => {
  try {
    const fetchedLanguages = await languageModel.getAllLanguages();
    res.status(200).json(fetchedLanguages);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getLanguageById = async (req, res) => {
  const id = req.params.id;
  try {
    const fetchedLanguage = await languageModel.getLanguageById(id);
    if (!fetchedLanguage) {
      return res.status(404).send("Language not found");
    }
    res.status(200).json(fetchedLanguage);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const createLanguage = async (req, res) => {
  const language = req.body;

  if (!language.name || !language.code) {
    return res.status(400).send("Please provide all required fields");
  }

  try {
    await languageModel.createLanguage(language);
    res.status(201).send("Language created successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const updateLanguage = async (req, res) => {
  const id = req.params.id;
  const language = req.body;

  if (!language.name || !language.code) {
    return res.status(400).send("Please provide all required fields");
  }

  try {
    const fetchedLanguage = languageModel.getLanguageById(id);
    if (!fetchedLanguage) {
      return res.status(404).send("Language not found");
    }

    await languageModel.updateLanguage(id, language);
    res.status(200).send("Language updated successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const deleteLanguage = async (req, res) => {
  const id = req.params.id;

  try {
    const fetchedLanguage = languageModel.getLanguageById(id);
    if (!fetchedLanguage) {
      return res.status(404).send("Language not found");
    }

    await languageModel.deleteLanguage(id);
    res.status(200).send("Language deleted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};

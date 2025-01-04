const levelModel = require("../models/levelModel");

const getAllLevels = async (req, res) => {
  try {
    const fetchedLevels = await levelModel.getAllLevels();
    return res.status(200).json(fetchedLevels);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

const getLevelById = async (req, res) => {
  const id = req.params.id;
  try {
    const fetchedLevel = await levelModel.getLevelById(id);
    if (!fetchedLevel) {
      return res.status(404).send("Level not found");
    }

    return res.status(200).json(fetchedLevel);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllLevels,
  getLevelById,
};

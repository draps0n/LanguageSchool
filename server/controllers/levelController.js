const levelModel = require("../models/levelModel");

const getAllLevels = (req, res) => {
  levelModel.getAllLevels((error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).json(results);
  });
};

const getLevelById = (req, res) => {
  const id = req.params.id;
  levelModel.getLevelById(id, (error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }

    if (!results) {
      return res.status(404).send("Level not found");
    }

    res.status(200).json(results);
  });
};

module.exports = {
  getAllLevels,
  getLevelById,
};

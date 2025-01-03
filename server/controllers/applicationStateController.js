const applicationStateModel = require("../models/applicationStateModel");

const getAllStates = (req, res) => {
  applicationStateModel.getAllStates((error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).json(results);
  });
};

const getStateById = (req, res) => {
  const id = req.params.id;
  applicationStateModel.getStateById(id, (error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }

    if (!results) {
      return res.status(404).send("Application state not found");
    }

    res.status(200).json(results);
  });
};

module.exports = {
  getAllStates,
  getStateById,
};

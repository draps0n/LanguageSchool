const applicationStateModel = require("../models/applicationStateModel");

const getAllStates = async (req, res) => {
  try {
    const fetchedStates = await applicationStateModel.getAllStates();
    res.status(200).json(fetchedStates);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getStateById = async (req, res) => {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).send("Application state ID is required");
  }

  try {
    const fetchedState = await applicationStateModel.getStateById(id);
    if (!fetchedState) {
      return res.status(404).send("Application state not found");
    }
    return res.status(200).json(fetchedState);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllStates,
  getStateById,
};

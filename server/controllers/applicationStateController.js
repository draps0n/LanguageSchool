const applicationStateModel = require("../models/applicationStateModel");

const getAllStates = async (req, res) => {
  try {
    const states = await applicationStateModel.getAllStates();
    res.status(200).json(states);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getStateById = async (req, res) => {
  const id = req.params.id;

  try {
    const state = await applicationStateModel.getStateById(id);
    if (!state) {
      return res.status(404).send("Application state not found");
    }
    return res.status(200).json(state);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllStates,
  getStateById,
};

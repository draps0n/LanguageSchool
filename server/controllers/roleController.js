const roleModel = require("../models/roleModel");

const getAllRoles = (req, res) => {
  roleModel.getAllRoles((error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }
    res.status(200).json(results);
  });
};

const getRoleById = (req, res) => {
  const id = req.params.id;
  roleModel.getRoleById(id, (error, results) => {
    if (error) {
      return res.status(500).send("Internal Server Error");
    }

    if (!results) {
      return res.status(404).send("Language not found");
    }

    res.status(200).json(results);
  });
};

module.exports = {
  getAllRoles,
  getRoleById,
};

const roleModel = require("../models/roleModel");

const getAllRoles = async (req, res) => {
  try {
    const fetchedRoles = await roleModel.getAllRoles();
    res.status(200).json(fetchedRoles);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const getRoleById = async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }
  try {
    const fetchedRole = await roleModel.getRoleById(id);

    if (!fetchedRole) {
      return res.status(404).send("Role not found");
    }

    res.status(200).json(fetchedRole);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
};

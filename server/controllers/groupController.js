const groupModel = require("../models/groupModel");

const getAllGroups = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const groups = await groupModel.getAllGroups(limit, offset);
    const totalGroups = await groupModel.getTotalGroups();

    res.status(200).json({
      groups,
      totalPages: Math.ceil(totalGroups / limit),
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getGroupById = async (req, res) => {
  const id = req.params.id;

  try {
    const group = await groupModel.getGroupById(id);
    const takenPlaces = await groupModel.getTakenPlaces(id);

    if (group) {
      res.status(200).json({ group, takenPlaces });
    } else {
      res.status(404).send("Group not found");
    }
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
};

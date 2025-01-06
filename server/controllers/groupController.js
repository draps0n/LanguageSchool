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

const deleteGroup = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send("Group id is required");
  }

  await groupModel.deleteGroup(id);

  res.status(200).send("Group deleted");
};

const createGroup = async (req, res) => {
  const group = req.body;

  const {
    places,
    price,
    description,
    levelId,
    day,
    startTime,
    endTime,
    teacherId,
    languageId,
  } = group;

  if (
    !places ||
    !price ||
    !description ||
    !levelId ||
    !day ||
    !startTime ||
    !endTime ||
    !teacherId ||
    !languageId
  ) {
    return res.status(400).send("All group fields are required");
  }

  try {
    await groupModel.createGroup(group);
    res.status(201).send("Group created");
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateGroup = async (req, res) => {
  const id = req.params.id;
  const group = req.body;

  const {
    places,
    price,
    description,
    levelId,
    day,
    startTime,
    endTime,
    teacherId,
    languageId,
  } = group;

  if (
    !places ||
    !price ||
    !description ||
    !levelId ||
    !day ||
    !startTime ||
    !endTime ||
    !teacherId ||
    !languageId
  ) {
    return res.status(400).send("All group fields are required");
  }

  if (!id) {
    return res.status(400).send("Group id is required");
  }

  try {
    await groupModel.updateGroup(id, group);
    res.status(200).send("Group updated");
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  deleteGroup,
  createGroup,
  updateGroup,
};

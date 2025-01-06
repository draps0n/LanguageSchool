const groupModel = require("../models/groupModel");
const teacherModel = require("../models/teacherModel");
const levelModel = require("../models/levelModel");
const languageModel = require("../models/languageModel");
const daysOfWeek = require("../constants/daysOfWeek");

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

const validateGroup = async (group) => {
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
    return { code: 400, message: "All group fields are required" };
  }

  if (places < 6 || places > 20) {
    return { code: 400, message: "Places must be between 6 and 20" };
  }

  if (price < 0) {
    return { code: 400, message: "Price must be a positive number" };
  }

  if (description.length < 5 || description.length > 250) {
    return {
      code: 400,
      message: "Description must be between 5 to 250 characters",
    };
  }

  const teacher = await teacherModel.getTeacherById(teacherId);
  if (!teacher) {
    return { code: 404, message: "Teacher not found" };
  }

  const level = await levelModel.getLevelById(levelId);
  if (!level) {
    return { code: 404, message: "Level not found" };
  }

  const language = await languageModel.getLanguageById(languageId);
  if (!language) {
    return { code: 404, message: "Language not found" };
  }

  if (daysOfWeek.indexOf(day) === -1) {
    return { code: 400, message: "Invalid day" };
  }

  if (startTime >= endTime) {
    return { code: 400, message: "End time must be later than start time" };
  }

  if (endTime <= startTime) {
    return { code: 400, message: "Start time must be earlier than end time" };
  }

  return null;
};

const createGroup = async (req, res) => {
  const group = req.body;

  // Walidacja grupy
  error = validateGroup(group);
  if (error) {
    return res.status(error.code).send(error.message);
  }

  // Dodanie grupy do bazy
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

  // Sprawdzenie czy podano id grupy
  if (!id) {
    return res.status(400).send("Group id is required");
  }

  // Walidacja grupy
  error = validateGroup(group);
  if (error) {
    return res.status(error.code).send(error.message);
  }

  // Aktualizacja grupy w bazie
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

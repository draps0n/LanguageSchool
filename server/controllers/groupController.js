const groupModel = require("../models/groupModel");
const teacherModel = require("../models/teacherModel");
const levelModel = require("../models/levelModel");
const languageModel = require("../models/languageModel");
const applicationModel = require("../models/applicationModel");
const daysOfWeek = require("../constants/daysOfWeek");
const { pool } = require("../db/database");

const getAllGroups = async (req, res) => {
  if (req.query.page && isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  // Pobranie parametrów paginacji
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;

  try {
    let groups;
    let totalGroups;
    if (page && limit) {
      // Pobranie grup
      groups = await groupModel.getAllGroups(limit, offset);

      // Pobranie liczby wszystkich grup
      totalGroups = await groupModel.getTotalGroups();
    } else {
      // Pobranie wszystkich grup
      groups = await groupModel.getAllGroups();

      // Pobranie liczby wszystkich grup
      totalGroups = groups.length;
    }

    // Zwrócenie grup
    res.status(200).json({
      groups,
      totalPages: Math.ceil(totalGroups / limit),
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGroupById = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Group id must be a number" });
  }

  try {
    // Pobranie grupy
    const group = await groupModel.getGroupById(id);

    // Pobranie zajętych miejsc w grupie
    const takenPlaces = await groupModel.getTakenPlaces(id);

    // Sprawdzenie czy grupa istnieje
    if (group) {
      res.status(200).json({ group, takenPlaces });
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteGroup = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Group id must be a number" });
  }

  const fetchedGroup = await groupModel.getGroupById(id);
  if (!fetchedGroup) {
    return res.status(404).json({ message: "Group not found" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Usunięcie zgłoszeń na grupę
    await applicationModel.deleteApplicationByGroupId(id, connection);

    // Usuń przypisania studentów do grupy
    await groupModel.deleteStudentGroupAssignments(id, connection);

    // Usunięcie grupy
    await groupModel.deleteGroup(id, connection);

    await connection.commit();
    res.status(200).send("Group deleted");
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    connection.release();
  }
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

  if (isNaN(places)) {
    return { code: 400, message: "Places must be a number" };
  }

  if (places < 6 || places > 20) {
    return { code: 400, message: "Places must be between 6 and 20" };
  }

  if (isNaN(price)) {
    return { code: 400, message: "Price must be a number" };
  }

  if (price < 0 || price > 1000) {
    return { code: 400, message: "Price must be in range (0, 1000)" };
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
  error = await validateGroup(group);
  if (error) {
    return res.status(error.code).json({ message: error.message });
  }

  // Konwersja miejsc i ceny na liczby
  group.places = parseInt(group.places);
  group.price = parseInt(group.price);

  // Dodanie grupy do bazy
  try {
    const groupId = await groupModel.addNewGroup(group);
    res.status(201).json({ message: "Group created", groupId });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateGroup = async (req, res) => {
  const id = req.params.id;
  const group = req.body;

  // Sprawdzenie czy podano id grupy
  if (!id) {
    return res.status(400).json({ message: "Group id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Group id must be a number" });
  }

  // Walidacja grupy
  error = await validateGroup(group);
  if (error) {
    return res.status(error.code).send(error.message);
  }

  // Konwersja miejsc i ceny na liczby
  group.places = parseInt(group.places);
  group.price = parseInt(group.price);

  // Aktualizacja grupy w bazie
  try {
    await groupModel.updateGroup(id, group);
    res.status(200).send("Group updated");
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllGroups,
  getGroupById,
  deleteGroup,
  createGroup,
  updateGroup,
};

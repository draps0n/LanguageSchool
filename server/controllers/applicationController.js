const applicationModel = require("../models/applicationModel");
const groupModel = require("../models/groupModel");
const applicationStateModel = require("../models/applicationStateModel");
const studentModel = require("../models/studentModel");

const addNewApplication = async (req, res) => {
  const { startDate, comment } = req.body;

  // Sprawdzenie czy użytkownik podał datę rozpoczęcia i id grupy
  if (!req.body.startDate || !req.body.groupId) {
    res.status(400).json({
      message: "Start date and group id are required",
    });
    return;
  }

  // Sprawdzenie czy opis jest w odpowiednim zakresie
  if (comment && (comment.length < 10 || comment.length > 300)) {
    res.status(400).json({
      message: "Comment must be between 10 and 300 characters",
    });
    return;
  }

  // Sprawdzenie czy data rozpoczęcia jest w odpowiednim zakresie
  const today = new Date();
  const nextMonth = new Date();
  const nextWeek = new Date();
  const startDateDate = new Date(startDate);

  nextMonth.setMonth(today.getMonth() + 1);
  nextWeek.setDate(today.getDate() + 7);

  if (startDateDate > nextMonth || startDateDate < nextWeek) {
    res.status(400).json({
      message:
        "Start date must be within the next month and not earlier than a week from now",
    });
    return;
  }

  // Sprawdzenie czy grupa istnieje
  try {
    const fetchedGroup = await groupModel.getGroupById(req.body.groupId);
    if (!fetchedGroup) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    // Sprawdzenie czy grupa nie jest pełna
    const takenPlaces = await groupModel.getTakenPlaces(req.body.groupId);
    if (takenPlaces >= fetchedGroup.places) {
      res.status(400).json({ message: "Group is full" });
      return;
    }

    // Pobranie stanu z bazy danych
    const state = await applicationStateModel.getStateByName(
      "W trakcie rozpatrywania"
    );

    if (!state) {
      console.error("State not found");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const application = {
      studentId: req.userId,
      startDate: req.body.startDate,
      groupId: req.body.groupId,
      comment: req.body.comment || null,
      state: state.id,
    };

    // Dodanie zgłoszenia do bazy danych
    await applicationModel.addNewApplication(application);
    res.status(201).send("Application added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteApplication = async (req, res) => {
  const applicationId = req.params.id;

  try {
    const fetchedApplication = await applicationModel.getApplicationById(
      applicationId
    );
    if (!fetchedApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    await applicationModel.deleteApplication(req.params.id);
    res.status(200).send("Application deleted");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getApplicationsForUser = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (isNaN(userId)) {
    res.status(400).json({ message: "User ID must be a number" });
    return;
  }

  const fetchedStudent = await studentModel.getStudentById(userId);
  if (!fetchedStudent) {
    res.status(404).json({ message: "Student not found" });
    return;
  }

  if (req.query.page && isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  // Pobranie parametrów paginacji
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const applications = await applicationModel.getUserApplications(
      userId,
      limit,
      offset
    );

    const totalApplications = await applicationModel.getTotalUserApplications(
      userId
    );

    res.status(200).json({
      applications,
      totalPages: Math.ceil(totalApplications / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllApplications = async (req, res) => {
  if (req.query.page && isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (req.query.limit && isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  // Pobranie parametrów paginacji
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const applications = await applicationModel.getAllApplications(
      limit,
      offset
    );

    const totalApplications = await applicationModel.getTotalApplications();

    res.status(200).json({
      applications,
      totalPages: Math.ceil(totalApplications / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addNewApplication,
  deleteApplication,
  getApplicationsForUser,
  getAllApplications,
};

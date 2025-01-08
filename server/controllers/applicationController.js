const applicationModel = require("../models/applicationModel");
const groupModel = require("../models/groupModel");
const applicationStateModel = require("../models/applicationStateModel");
const studentModel = require("../models/studentModel");
const employeeModel = require("../models/employeeModel");
const applicationStates = require("../constants/applicationStates");
const { pool } = require("../db/database");

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
  const userId = req.userId;

  if (!userId || isNaN(userId)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const fetchedApplication = await applicationModel.getApplicationById(
      applicationId
    );

    if (!fetchedApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    if (fetchedApplication.studentId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (fetchedApplication.status !== applicationStates.PENDING) {
      res
        .status(403)
        .json({ message: "You can only delete pending applications" });
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

const updateApplicationByUser = async (req, res) => {
  const { startDate, groupId, comment } = req.body;
  const applicationId = req.params.id;

  // Sprawdzenie czy użytkownik podał datę rozpoczęcia i id grupy
  if (!startDate || !groupId) {
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

  try {
    const fetchedApplication = await applicationModel.getApplicationById(
      applicationId
    );

    // Sprawdzenie czy aplikacja istnieje
    if (!fetchedApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    // Sprawdzenie czy aplikacja należy do użytkownika
    if (fetchedApplication.studentId !== req.userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    console.log(fetchedApplication);
    // Sprawdzenie czy aplikacja jest w odpowiednim stanie
    if (fetchedApplication.status !== applicationStates.PENDING) {
      res
        .status(403)
        .json({ message: "You can only edit pending applications" });
      return;
    }

    // Sprawdzenie czy grupa istnieje
    const fetchedGroup = await groupModel.getGroupById(req.body.groupId);
    if (!fetchedGroup) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    // Sprawdzenie, jeśli grupa jest zmieniana, czy nowa grupa nie jest pełna
    const takenPlaces = await groupModel.getTakenPlaces(groupId);
    if (
      fetchedApplication.groupId !== req.body.groupId &&
      takenPlaces >= fetchedGroup.places
    ) {
      res.status(400).json({ message: "Group is full" });
      return;
    }

    const application = {
      id: req.params.id,
      startDate: req.body.startDate,
      groupId: req.body.groupId,
      comment: req.body.comment || null,
    };

    // Edytowanie zgłoszenia w bazie danych
    await applicationModel.updateApplicationByUser(application);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const reviewApplication = async (req, res) => {
  const userId = req.userId;
  const applicationId = req.params.id;
  const { feedbackMessage, newStatus } = req.body;

  if (!userId || isNaN(userId)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const fetchedEmployee = await employeeModel.getEmployeeById(userId);
  if (!fetchedEmployee) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }

  if (!applicationId && isNaN(applicationId)) {
    res
      .status(400)
      .json({ message: "Application ID is required and must be a number" });
    return;
  }

  const fetchedApplication = await applicationModel.getApplicationById(
    applicationId
  );
  if (!fetchedApplication) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  if (fetchedApplication.status !== applicationStates.PENDING) {
    res
      .status(403)
      .json({ message: "You can only review pending applications" });
    return;
  }

  if (!newStatus || isNaN(newStatus)) {
    res
      .status(400)
      .json({ message: "New status is required and must be a number" });
    return;
  }

  const fetchedState = await applicationStateModel.getStateById(newStatus);
  if (!fetchedState) {
    res.status(404).json({ message: "State not found" });
    return;
  }

  if (newStatus === applicationStates.PENDING) {
    res.status(400).json({ message: "New status cannot be pending" });
    return;
  }

  if (
    feedbackMessage &&
    (feedbackMessage.length > 200 || feedbackMessage.length < 10)
  ) {
    res.status(400).json({
      message: "Feedback message must be between 10-200 characters long",
    });
    return;
  }

  const applicationUpdate = {
    id: applicationId,
    status: newStatus,
    feedbackMessage: feedbackMessage || null,
    employeeId: userId,
  };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await applicationModel.updateApplicationByEmployee(
      applicationUpdate,
      connection
    );

    if (newStatus === applicationStates.ACCEPTED) {
      await groupModel.addStudentToGroup(
        fetchedApplication.studentId,
        fetchedApplication.groupId,
        connection
      );
    }

    await connection.commit();
    res.sendStatus(204);
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

const getApplicationEditableData = async (req, res) => {
  const userId = req.userId;
  const applicationId = req.params.id;

  if (!userId || isNaN(userId)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!applicationId || isNaN(applicationId)) {
    res
      .status(400)
      .json({ message: "Application ID is required and must be a number" });
    return;
  }

  try {
    const fetchApplication = await applicationModel.getApplicationById(
      applicationId
    );

    if (!fetchApplication) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    if (fetchApplication.studentId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const application = await applicationModel.getApplicationEditableDataById(
      applicationId
    );
    res.status(200).json(application);
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
  updateApplicationByUser,
  reviewApplication,
  getApplicationEditableData,
};

const teacherModel = require("../models/teacherModel");
const languageModel = require("../models/languageModel");
const { getRoles } = require("../config/roles");

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.getAllTeachers();

    const teachersWithLanguages = await Promise.all(
      teachers.map(async (teacher) => {
        const languages = await teacherModel.getTeacherLanguages(teacher.id);
        return { ...teacher, languages };
      })
    );

    res.status(200).json(teachersWithLanguages);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeacherLanguages = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    res
      .status(400)
      .json({ message: "Missing teacher ID. It has to be a number." });
    return;
  }

  if (req.roleId === getRoles().NAUCZYCIEL && req.userId !== parseInt(id)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    const fetchedTeacher = await teacherModel.getTeacherById(id);
    if (!fetchedTeacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }

    const languages = await teacherModel.getTeacherLanguages(id);
    res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching teacher languages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeTeacherLanguage = async (req, res) => {
  const { teacherId, languageId } = req.params;

  if (!teacherId || !languageId) {
    res.status(400).json({ message: "Missing teacher or language ID" });
    return;
  }

  if (isNaN(teacherId) || isNaN(languageId)) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }

  try {
    const fetchedTeacher = await teacherModel.getTeacherById(teacherId);
    if (!fetchedTeacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }

    const fetchedLanguage = await languageModel.getLanguageById(languageId);
    if (!fetchedLanguage) {
      res.status(404).json({ message: "Language not found" });
      return;
    }

    const teacherLanguage = await teacherModel.getTeacherLanguage(
      teacherId,
      languageId
    );

    if (!teacherLanguage) {
      res.status(404).json({ message: "Teacher does not know this language" });
      return;
    }

    const teacherGroupsCountWithLanguage =
      await teacherModel.getTeacherGroupsCountWithLanguage(
        teacherId,
        languageId
      );

    if (teacherGroupsCountWithLanguage > 0) {
      res.status(409).json({
        message: "Cannot remove language that is assigned to groups",
      });
      return;
    }

    await teacherModel.deleteTeacherKnownLanguage(teacherId, languageId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting teacher language:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTeacherLanguage = async (req, res) => {
  const { teacherId } = req.params;
  const { languageId } = req.body;

  if (!teacherId || !languageId) {
    res.status(400).json({ message: "Missing teacher or language ID" });
    return;
  }

  if (isNaN(teacherId) || isNaN(languageId)) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }

  try {
    const fetchedTeacher = await teacherModel.getTeacherById(teacherId);
    if (!fetchedTeacher) {
      res.status(404).json({ message: "Teacher not found" });
      return;
    }

    const fetchedLanguage = await languageModel.getLanguageById(languageId);
    if (!fetchedLanguage) {
      res.status(404).json({ message: "Language not found" });
      return;
    }

    const teacherLanguage = await teacherModel.getTeacherLanguage(
      teacherId,
      languageId
    );

    if (teacherLanguage) {
      res.status(409).json({ message: "Teacher already knows this language" });
      return;
    }

    await teacherModel.addTeacherLanguage(teacherId, languageId);
    res.sendStatus(201);
  } catch (error) {
    console.error("Error adding teacher language:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherLanguages,
  removeTeacherLanguage,
  addTeacherLanguage,
};

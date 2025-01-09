const teacherModel = require("../models/teacherModel");

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.getAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTeacherLanguages = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Missing teacher ID" });
    return;
  }

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }

  try {
    const languages = await teacherModel.getTeacherLanguages(id);
    res.status(200).json(languages);
  } catch (error) {
    console.error("Error fetching teacher languages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherLanguages,
};

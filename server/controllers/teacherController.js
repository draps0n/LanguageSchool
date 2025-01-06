const teacherModel = require("../models/teacherModel");

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.getAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllTeachers,
};

const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const studentModel = require("../models/studentModel");
const employeeModel = require("../models/employeeModel");
const teacherModel = require("../models/teacherModel");
const groupModel = require("../models/groupModel");
const applicationModel = require("../models/applicationModel");
const { pool } = require("../db/database");
const { getRoles } = require("../config/roles");

const getUserProfileDetails = async (req, res) => {
  if (!req.userId || !req.roleId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await userModel.findUserById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.params.id;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "User ID must be a number" });
  }

  try {
    const user = await userModel.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  if (!req.query.page || isNaN(req.query.page)) {
    return res.status(400).json({ message: "Page must be a number" });
  }

  if (!req.query.limit || isNaN(req.query.limit)) {
    return res.status(400).json({ message: "Limit must be a number" });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const users = await userModel.getAllUsers(limit, offset);
    const totalUsers = await userModel.getTotalUsers();
    const totalPages = Math.ceil(totalUsers / limit);
    res
      .status(200)
      .send({ users, totalPages: totalPages > 0 ? totalPages : 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  let {
    name,
    lastName,
    email,
    dateOfBirth,
    password,
    newPassword,
    description,
    salary,
  } = req.body;

  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await userModel.getUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const fetchedStudent = await studentModel.getStudentById(req.userId);
  const fetchedEmployee = await employeeModel.getEmployeeById(req.userId);
  if (req.roleId === getRoles().STUDENT && !fetchedStudent) {
    return res.status(404).json({ message: "Student not found" });
  } else if (req.roleId === getRoles().EMPLOYEE && !fetchedEmployee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  if (user.name.length < 3 || user.name.length > 50) {
    return res
      .status(400)
      .json({ message: "Name must be between 3 and 50 characters" });
  }

  if (user.lastName.length < 3 || user.lastName.length > 50) {
    return res
      .status(400)
      .json({ message: "Last name must be between 3 and 50 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateOfBirth)) {
    return res.status(400).send("Date must be in YYYY-MM-DD format");
  }

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  if (birthDate > today) {
    return res.status(400).send("Date of birth cannot be in the future");
  }

  if (
    birthDate >
    new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  ) {
    return res.status(400).send("User must be at least 18 years old");
  }

  if (
    req.roleId === getRoles.STUDENT &&
    (description.length < 10 || description.length > 200)
  ) {
    return res
      .status(400)
      .send("Description must be between 10 and 200 characters");
  }

  if (
    req.roleId === getRoles.EMPLOYEE &&
    (salary < 0 || salary > 100000 || isNaN(salary))
  ) {
    return res.status(400).send("Salary must be a number between 0 and 100000");
  }

  const isEmailTaken = await userModel.getUserByEmail(email);
  if (isEmailTaken && isEmailTaken.id !== req.userId) {
    return res.status(409).json({ message: "Email already taken" });
  }

  if (newPassword) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    password = hashedPassword;
  } else {
    password = user.password;
  }

  const updatedUser = {
    id: req.userId,
    name,
    lastName,
    email,
    dateOfBirth,
    password,
  };

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await userModel.updateUser(updatedUser, connection);

    if (user.role === getRoles().STUDENT && description) {
      await studentModel.updateStudent(
        req.userId,
        {
          description,
          discount: fetchedStudent.czy_rabat,
        },
        connection
      );
    } else if (user.role === getRoles().EMPLOYEE && salary) {
      await employeeModel.updateEmployee(req.userId, salary, connection);
    }

    await connection.commit();
    res.status(200).send("User updated");
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};

const deleteUserProfile = async (req, res) => {
  if (!req.userId || !req.roleId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const connection = await pool.getConnection();
  try {
    const user = await userModel.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    switch (req.roleId) {
      case getRoles().KURSANT:
        connection.beginTransaction();
        // Usunięcie zgłoszeń kursanta
        await applicationModel.deleteApplicationsByStudentId(
          req.userId,
          connection
        );

        // Usunięcie przypisania kursanta do grup
        await groupModel.deleteGroupsMembershipsByStudentId(
          req.userId,
          connection
        );

        // Usunięcie kursanta
        await studentModel.deleteStudent(req.userId, connection);
        break;
      case getRoles().PRACOWNIK_ADMINISTRACYJNY:
        connection.beginTransaction();
        // Usunięcie pracownika z rozpatrzonych zgłoszeń
        await applicationModel.updateApplicationsByEmployeeId(
          req.userId,
          connection
        );

        // Usunięcie pracownika
        await employeeModel.deleteEmployee(req.userId, connection);
        break;
      case getRoles().NAUCZYCIEL:
        // Sprawdzenie czy nauczyciel prowadzi jakieś grupy
        const teacherGroups = await groupModel.getTotalTeacherGroups(
          req.userId
        );
        if (teacherGroups > 0) {
          return res.status(409).json({
            message: "Cannot delete teacher with groups assigned",
          });
        }

        // Usunięcie języków nauczyciela
        connection.beginTransaction();
        await teacherModel.deleteAllTeacherKnownLanguages(
          req.userId,
          connection
        );

        // Usunięcie nauczyciela
        await teacherModel.deleteTeacher(req.userId, connection);
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    // Usunięcie użytkownika
    await userModel.deleteUser(req.userId, connection);
    connection.commit();
    res.status(200).send("User deleted");
  } catch (error) {
    connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

module.exports = {
  getUserDetails,
  getUserProfileDetails,
  updateUser,
  getAllUsers,
  deleteUserProfile,
};

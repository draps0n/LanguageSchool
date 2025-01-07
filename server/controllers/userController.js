const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const studentModel = require("../models/studentModel");
const employeeModel = require("../models/employeeModel");
const { pool } = require("../db/database");
const { getRoles } = require("../config/roles");

const getUserById = async (req, res) => {
  if (!req.userId || !req.roleId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await userModel.findUserById(req.userId);

  return res.status(200).json(user);
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

module.exports = {
  getUserById,
  updateUser,
};

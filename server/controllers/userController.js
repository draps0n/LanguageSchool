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

  console.log(password, newPassword);

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

  const isEmailTaken = await userModel.getUserByEmail(email);
  if (isEmailTaken && isEmailTaken.id !== req.userId) {
    return res.status(409).json({ message: "Email already taken" });
  }

  console.log("user.password", user.password);
  if (newPassword) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
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

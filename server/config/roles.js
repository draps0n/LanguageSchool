const { pool } = require("../db/database");

const roles = {};

const initializeRoles = async () => {
  try {
    const [results] = await pool.query("SELECT * FROM rola");

    results.forEach((role) => {
      roles[role.nazwa.replace(/\s+/g, "_").toUpperCase()] = role.id;
    });
    console.log("Roles initialized:", roles);
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
};

const getRoles = () => roles;

module.exports = { getRoles, initializeRoles };

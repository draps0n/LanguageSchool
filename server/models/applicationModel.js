const { pool } = require("../db/database");

const addNewApplication = async (application) => {
  const [results] = await pool.query(
    `INSERT INTO zgloszenie (kursant, grupa, data_rozpoczecia, uwagi, data_przeslania, status)
        VALUES (?, ?, ?, ?, NOW(), ?)`,
    [
      application.studentId,
      application.groupId,
      application.startDate,
      application.comment,
      application.state,
    ]
  );

  return results;
};

const deleteApplicationById = async (id) => {
  await pool.query(`DELETE FROM zgloszenie WHERE id = ?`, [id]);
};

module.exports = {
  addNewApplication,
  deleteApplicationById,
};

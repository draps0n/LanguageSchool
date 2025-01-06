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

module.exports = {
  addNewApplication,
};

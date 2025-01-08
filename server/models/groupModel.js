const { pool } = require("../db/database");

const getAllGroups = async (limit, offset) => {
  let query = `
    SELECT g.id, g.liczba_miejsc, g.cena_zajec, g.opis, j.nazwa as jezyk, j.skrot as skrot, pj.nazwa as poziom, g.dzien_tygodnia, g.godzina_rozpoczecia, g.godzina_zakonczenia
    FROM grupa g
    INNER JOIN jezyk j ON j.id = g.jezyk
    INNER JOIN poziom_jezyka pj ON pj.id = g.poziom
    `;
  const params = [];

  if (limit && offset) {
    query += ` LIMIT $1 OFFSET $2`;
    params.push(limit, offset);
  }

  const [results] = await pool.query(query, params);

  return results.map((group) => {
    return {
      id: group.id,
      places: group.liczba_miejsc,
      price: group.cena_zajec,
      description: group.opis,
      language: group.jezyk,
      languageCode: group.skrot,
      level: group.poziom,
      day: group.dzien_tygodnia,
      startTime: group.godzina_rozpoczecia,
      endTime: group.godzina_zakonczenia,
    };
  });
};

const getUserGroups = async (userId, limit, offset) => {
  let query = `
    SELECT g.id, g.liczba_miejsc, g.cena_zajec, g.opis, j.nazwa as jezyk, j.skrot as skrot, pj.nazwa as poziom, g.dzien_tygodnia, g.godzina_rozpoczecia, g.godzina_zakonczenia, u.liczba_nieobecnosci
    FROM grupa g
    INNER JOIN jezyk j ON j.id = g.jezyk
    INNER JOIN poziom_jezyka pj ON pj.id = g.poziom
    INNER JOIN uczestnictwo u ON u.grupa = g.id
    WHERE u.kursant = ?
    `;
  const params = [userId];

  if (limit && offset) {
    query += ` LIMIT $1 OFFSET $2`;
    params.push(limit, offset);
  }

  const [results] = await pool.query(query, params);

  return results.map((group) => {
    return {
      id: group.id,
      places: group.liczba_miejsc,
      price: group.cena_zajec,
      description: group.opis,
      language: group.jezyk,
      languageCode: group.skrot,
      level: group.poziom,
      day: group.dzien_tygodnia,
      startTime: group.godzina_rozpoczecia,
      endTime: group.godzina_zakonczenia,
      absencesNumber: group.liczba_nieobecnosci,
    };
  });
};

const getTotalGroups = async () => {
  const [results] = await pool.query(
    `SELECT COUNT(*) as totalGroups FROM grupa`
  );

  return results[0].totalGroups;
};

const getTotalUserGroups = async (userId) => {
  const [results] = await pool.query(
    `
    SELECT COUNT(*) as totalGroups
    FROM uczestnictwo u
    WHERE u.kursant = ?
    `,
    [userId]
  );

  return results[0].totalGroups;
};

const getGroupById = async (id) => {
  const [results] = await pool.query(
    `
    SELECT g.id, g.liczba_miejsc, g.cena_zajec, g.opis, j.id as jezykId, j.nazwa as jezyk, j.skrot as skrot, pj.id as poziomId, pj.nazwa as poziom, g.dzien_tygodnia, g.godzina_rozpoczecia, g.godzina_zakonczenia, u.imie, u.nazwisko, g.nauczyciel
    FROM grupa g
    INNER JOIN jezyk j ON j.id = g.jezyk
    INNER JOIN poziom_jezyka pj ON pj.id = g.poziom
    INNER JOIN uzytkownik u ON u.id = g.nauczyciel
    WHERE g.id = ?
    `,
    [id]
  );

  if (results.length === 0) {
    return null;
  }

  const group = results[0];

  return {
    id: group.id,
    places: group.liczba_miejsc,
    price: group.cena_zajec,
    description: group.opis,
    day: group.dzien_tygodnia,
    startTime: group.godzina_rozpoczecia,
    endTime: group.godzina_zakonczenia,
    teacher: {
      id: group.nauczyciel,
      name: group.imie,
      lastName: group.nazwisko,
    },
    level: {
      id: group.poziomId,
      name: group.poziom,
    },
    language: {
      id: group.jezykId,
      name: group.jezyk,
      code: group.skrot,
    },
  };
};

const getTakenPlaces = async (groupId) => {
  const [results] = await pool.query(
    `
    SELECT COUNT(*) as takenPlaces
    FROM uczestnictwo
    WHERE grupa = ?
    `,
    [groupId]
  );

  return results[0].takenPlaces;
};

const deleteGroup = async (id, connection) => {
  await connection.query(
    `
    DELETE FROM grupa
    WHERE id = ?
    `,
    [id]
  );
};

const addNewGroup = async (group) => {
  const [results] = await pool.query(
    `
    INSERT INTO grupa (liczba_miejsc, cena_zajec, opis, jezyk, poziom, dzien_tygodnia, godzina_rozpoczecia, godzina_zakonczenia, nauczyciel)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      group.places,
      group.price,
      group.description,
      group.languageId,
      group.levelId,
      group.day,
      group.startTime,
      group.endTime,
      group.teacherId,
    ]
  );

  return results.insertId;
};

const updateGroup = async (groupId, group) => {
  await pool.query(
    `
    UPDATE grupa
    SET liczba_miejsc = ?, cena_zajec = ?, opis = ?, jezyk = ?, poziom = ?, dzien_tygodnia = ?, godzina_rozpoczecia = ?, godzina_zakonczenia = ?, nauczyciel = ?
    WHERE id = ?
    `,
    [
      group.places,
      group.price,
      group.description,
      group.languageId,
      group.levelId,
      group.day,
      group.startTime,
      group.endTime,
      group.teacherId,
      groupId,
    ]
  );
};

const deleteStudentGroupAssignments = async (groupId, connection) => {
  await connection.query(
    `
    DELETE FROM uczestnictwo
    WHERE grupa = ?
    `,
    [groupId]
  );
};

const addStudentToGroup = async (studentId, groupId, connection) => {
  await connection.query(
    `
    INSERT INTO uczestnictwo (kursant, grupa, liczba_nieobecnosci)
    VALUES (?, ?, 0)
    `,
    [studentId, groupId]
  );
};

module.exports = {
  getAllGroups,
  getTotalGroups,
  getGroupById,
  getTakenPlaces,
  deleteGroup,
  addNewGroup,
  updateGroup,
  deleteStudentGroupAssignments,
  getUserGroups,
  getTotalUserGroups,
  addStudentToGroup,
};

const { pool } = require("../db/database");

const getAllGroups = async (limit, offset) => {
  const [results] = await pool.query(
    `
    SELECT g.id, g.liczba_miejsc, g.cena_zajec, g.opis, j.nazwa as jezyk, pj.nazwa as poziom, g.dzien_tygodnia, g.godzina_rozpoczecia, g.godzina_zakonczenia
    FROM grupa g
    INNER JOIN jezyk j ON j.id = g.jezyk
    INNER JOIN poziom_jezyka pj ON pj.id = g.poziom
    LIMIT ?
    OFFSET ?
    `,
    [limit, offset]
  );

  return results.map((group) => {
    return {
      id: group.id,
      places: group.liczba_miejsc,
      price: group.cena_zajec,
      description: group.opis,
      language: group.jezyk,
      level: group.poziom,
      day: group.dzien_tygodnia,
      startTime: group.godzina_rozpoczecia,
      endTime: group.godzina_zakonczenia,
    };
  });
};

const getTotalGroups = async () => {
  const [results] = await pool.query(
    `SELECT COUNT(*) as totalGroups FROM grupa`
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

const deleteGroup = async (id) => {
  await pool.query(
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

const deleteStudentGroupAssignments = async (groupId) => {
  await pool.query(
    `
    DELETE FROM uczestnictwo
    WHERE grupa = ?
    `,
    [groupId]
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
};

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
    SELECT g.id, g.liczba_miejsc, g.cena_zajec, g.opis, j.nazwa as jezyk, pj.nazwa as poziom, g.dzien_tygodnia, g.godzina_rozpoczecia, g.godzina_zakonczenia, u.imie, u.nazwisko
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
    language: group.jezyk,
    level: group.poziom,
    day: group.dzien_tygodnia,
    startTime: group.godzina_rozpoczecia,
    endTime: group.godzina_zakonczenia,
    teacherName: group.imie,
    teacherLastName: group.nazwisko,
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

module.exports = {
  getAllGroups,
  getTotalGroups,
  getGroupById,
  getTakenPlaces,
};

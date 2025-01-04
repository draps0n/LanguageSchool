INSERT INTO Jezyk (nazwa, skrot)
VALUES
('angielski', 'en'),
('niemiecki', 'de');

INSERT INTO Rola (nazwa)
VALUES
('Pracownik administracyjny'),
('Kursant'),
('Nauczyciel');

INSERT INTO Poziom_jezyka (pozycja, nazwa)
VALUES
(1, 'A1'),
(2, 'A2'),
(3, 'B1'),
(4, 'B2'),
(5, 'C1'),
(6, 'C2');

INSERT INTO Status_zgloszenia (nazwa)
VALUES
('W trakcie rozpatrywania'),
('Odrzucone'),
('Zaakceptowane');

-- INSERT INTO nauczyciel (id, przepracowane_godziny, stawka_godzinowa)
-- VALUES(1, 45.5, 60)

INSERT INTO Grupa (liczba_miejsc, opis, cena_zajec, nauczyciel, jezyk, poziom, dzien_tygodnia, godzina_rozpoczecia, godzina_zakonczenia)
VALUES
(10, 'Opis', 140.5, 1, 1, 1, 'sroda', '17:00:00', '18:30:00'),
(11, 'Opis', 140.5, 1, 1, 1, 'wtorek', '17:00:00', '18:30:00'),
(12, 'Opis', 140.5, 1, 1, 1, 'czwartek', '17:00:00', '18:30:00'),
(13, 'Opis', 140.5, 1, 1, 1, 'sobota', '17:00:00', '18:30:00'),
(14, 'Opis', 140.5, 1, 1, 1, 'piatek', '17:00:00', '18:30:00'),
(15, 'Opis', 140.5, 1, 1, 1, 'sobota', '17:00:00', '18:30:00'),
(16, 'Opis', 140.5, 1, 1, 1, 'czwartek', '17:00:00', '18:30:00'),
(17, 'Opis', 140.5, 1, 1, 1, 'piatek', '17:00:00', '18:30:00');
VALUES(18, 'Opis', 140.5, 1, 1, 1, 'sroda', '17:00:00', '18:30:00')
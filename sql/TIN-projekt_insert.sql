INSERT INTO Jezyk (nazwa, skrot)
VALUES
('angielski', 'en'),
('niemiecki', 'de'),
('francuski', 'fr'),
('hiszpanski', 'es');

INSERT INTO Rola (id, nazwa)
VALUES
(1, 'Pracownik administracyjny'),
(2, 'Kursant'),
(3, 'Nauczyciel');

INSERT INTO Poziom_jezyka (pozycja, nazwa)
VALUES
(1, 'A1'),
(2, 'A2'),
(3, 'B1'),
(4, 'B2'),
(5, 'C1'),
(6, 'C2');

INSERT INTO Status_zgloszenia (id, nazwa)
VALUES
(1, 'W trakcie rozpatrywania'),
(2, 'Odrzucone'),
(3, 'Zaakceptowane');

INSERT INTO uzytkownik (imie, nazwisko, email, data_urodzenia, haslo, refresh_token, rola)
VALUES
('Adam', 'Zimny', 'az@o.pl', '2002-11-12', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 1),
('Krzysztof', 'Drapała', 'kd@o.pl', '2003-12-19', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 1),
('Weronika', 'Kowalska', 'wk@o.pl', '2003-04-03', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 1),
('Zofia', 'Mucha', 'zf@o.pl', '1996-05-05', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 2),
('Kamil', 'Kran', 'kk@.o.pl', '1990-03-01', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 2),
('Wiktor', 'Zięć', 'wz@o.pl', '1986-01-17', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 2),
('Wiktoria', 'Polska', 'wp@o.pl', '1999-07-08', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 3),
('Jan', 'Kowalski', 'jk@o.pl', '1957-12-01', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 3),
('Andrzej', 'Kwiat', 'ak@o.pl', '1987-02-28', '$2b$10$MGUworWOzp9aejONkGpG9u3kxw28bYJN4ZXb1hqSe8Xg1tqG0JnT.', '', 3);

INSERT INTO pracownik_administracyjny (id, pensja)
VALUES
(1, 5000),
(2, 7000),
(3, 9000);

INSERT INTO kursant (id, czy_rabat, opis)
VALUES
(4, 't', 'Lubię języki'),
(5, 'n', 'Chcę poszerzać horyzonty'),
(6, 'n', 'Pragnę mieszkać za granicą');

INSERT INTO nauczyciel (id, przepracowane_godziny, stawka_godzinowa)
VALUES
(7, 45, 60),
(8, 36, 65),
(9, 59, 75);

INSERT INTO Grupa (liczba_miejsc, opis, cena_zajec, nauczyciel, jezyk, poziom, dzien_tygodnia, godzina_rozpoczecia, godzina_zakonczenia)
VALUES
(11, 'Opis1', 140.5, 7, 1, 1, 'wtorek', '17:00:00', '18:30:00'),
(12, 'Opis2', 140.5, 8, 2, 2, 'czwartek', '17:00:00', '18:30:00'),
(13, 'Opis3', 144.5, 9, 4, 3, 'sobota', '17:00:00', '18:30:00'),
(14, 'Opis4', 123.5, 8, 3, 4, 'piatek', '17:00:00', '18:30:00'),
(15, 'Opis5', 150.5, 7, 3, 5, 'sobota', '17:00:00', '18:30:00'),
(16, 'Opis6', 140.5, 8, 2, 6, 'czwartek', '17:00:00', '18:30:00'),
(17, 'Opis7', 150.5, 9, 1, 5, 'piatek', '17:00:00', '18:30:00'),
(10, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum condimentum urna non ullamcorper. Donec dapibus nibh lectus, vitae mollis eros porta id. Phasellus id faucibus risus, vitae.', 140.5, 8, 3, 6, 'sroda', '17:00:00', '18:30:00');

INSERT INTO uczestnictwo (kursant, grupa, liczba_nieobecnosci)
VALUES
(4, 2, 0),
(4, 4, 1),
(5, 1, 3),
(5, 5, 2),
(5, 6, 2),
(5, 7, 1),
(6, 1, 1),
(6, 2, 0),
(6, 7, 0);

INSERT INTO znajomosc_jezyka (nauczyciel, jezyk)
VALUES
(7, 1),
(7, 3),
(8, 1),
(8, 2),
(8, 3),
(9, 1),
(9, 2),
(9, 4);

INSERT INTO zgloszenie (kursant, grupa, data_rozpoczecia, uwagi, data_przeslania, status, pracownik_rozpatrujacy, wiadomosc_zwrotna)
VALUES
(4, 2, '2024-11-07', null, '2024-10-28', 3, 1, null),
(4, 4, '2024-11-12', 'Bardzo mi zależy', '2024-11-02', 3, 2, 'Proszę bardzo :)'),
(5, 1, '2024-11-12', null, '2024-11-03', 3, 3, null),
(5, 5, '2024-11-21', null, '2024-11-13', 3, 2, 'Zaakceptowane'),
(5, 6, '2024-11-25', 'Od dziecka chciałem nauczyć się tego języka!', '2024-11-15', 3, 1, null),
(5, 7, '2024-12-19', null, '2024-11-25', 3, 2, 'Zapraszam!'),
(6, 1, '2024-11-27', null, '2024-11-19', 3, 3, null),
(6, 2, '2024-12-07', null, '2024-11-28', 3, 2, null),
(6, 7, '2024-12-04', null, '2024-11-25', 3, 1, null),
(4, 1, '2024-12-24', null, '2024-12-15', 2, 2, null),
(5, 2, '2024-12-26', 'Może dam radę?', '2024-12-17', 2, 3, 'Raczej nie...'),
(5, 3, '2025-01-25', null, '2025-01-04', 1, null, null),
(6, 1, '2025-01-22', 'Mam certyfikaty', '2025-01-05', 1, null, null);



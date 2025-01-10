-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-01-10 22:10:44.548

-- foreign keys
ALTER TABLE Grupa
    DROP FOREIGN KEY Grupa_Jezyk;

ALTER TABLE Grupa
    DROP FOREIGN KEY Grupa_Nauczyciel;

ALTER TABLE Grupa
    DROP FOREIGN KEY Grupa_Poziom_jezyka;

ALTER TABLE Kursant
    DROP FOREIGN KEY Kursant_Uzytkownik;

ALTER TABLE Nauczyciel
    DROP FOREIGN KEY Nauczyciel_Uzytkownik;

ALTER TABLE Pracownik_administracyjny
    DROP FOREIGN KEY Pracownik_administracyjny_Uzytkownik;

ALTER TABLE Uczestnictwo
    DROP FOREIGN KEY Uczestnictwo_Grupa;

ALTER TABLE Uczestnictwo
    DROP FOREIGN KEY Uczestnictwo_Kursant;

ALTER TABLE Uzytkownik
    DROP FOREIGN KEY Uzytkownik_Rola;

ALTER TABLE Zgloszenie
    DROP FOREIGN KEY Zgloszenie_Grupa;

ALTER TABLE Zgloszenie
    DROP FOREIGN KEY Zgloszenie_Kursant;

ALTER TABLE Zgloszenie
    DROP FOREIGN KEY Zgloszenie_Pracownik_administracyjny;

ALTER TABLE Zgloszenie
    DROP FOREIGN KEY Zgloszenie_Status_zgloszenia;

ALTER TABLE Znajomosc_jezyka
    DROP FOREIGN KEY Znajomosc_jezyka_Jezyk;

ALTER TABLE Znajomosc_jezyka
    DROP FOREIGN KEY Znajomosc_jezyka_Nauczyciel;

-- tables
DROP TABLE Grupa;

DROP TABLE Jezyk;

DROP TABLE Kursant;

DROP TABLE Nauczyciel;

DROP TABLE Poziom_jezyka;

DROP TABLE Pracownik_administracyjny;

DROP TABLE Rola;

DROP TABLE Status_zgloszenia;

DROP TABLE Uczestnictwo;

DROP TABLE Uzytkownik;

DROP TABLE Zgloszenie;

DROP TABLE Znajomosc_jezyka;

-- End of file.


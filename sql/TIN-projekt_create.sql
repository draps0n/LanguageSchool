-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2025-01-06 16:09:46.867

-- tables
-- Table: Grupa
CREATE TABLE Grupa (
    id int  NOT NULL AUTO_INCREMENT,
    liczba_miejsc int  NOT NULL,
    opis nvarchar(250)  NOT NULL,
    cena_zajec decimal(5,2)  NOT NULL,
    nauczyciel int  NOT NULL,
    jezyk int  NOT NULL,
    poziom int  NOT NULL,
    dzien_tygodnia nvarchar(30)  NOT NULL,
    godzina_rozpoczecia time  NOT NULL,
    godzina_zakonczenia time  NOT NULL,
    CONSTRAINT Grupa_pk PRIMARY KEY (id)
);

-- Table: Jezyk
CREATE TABLE Jezyk (
    id int  NOT NULL AUTO_INCREMENT,
    nazwa nvarchar(20)  NOT NULL,
    skrot char(2)  NOT NULL,
    CONSTRAINT Jezyk_pk PRIMARY KEY (id)
);

-- Table: Kursant
CREATE TABLE Kursant (
    id int  NOT NULL,
    czy_rabat char(1)  NOT NULL,
    opis nvarchar(200)  NOT NULL,
    CONSTRAINT Kursant_pk PRIMARY KEY (id)
);

-- Table: Nauczyciel
CREATE TABLE Nauczyciel (
    id int  NOT NULL,
    przepracowane_godziny decimal(4,1)  NOT NULL,
    stawka_godzinowa decimal(4,2)  NOT NULL,
    CONSTRAINT Nauczyciel_pk PRIMARY KEY (id)
);

-- Table: Poziom_jezyka
CREATE TABLE Poziom_jezyka (
    id int  NOT NULL AUTO_INCREMENT,
    pozycja int  NOT NULL,
    nazwa char(2)  NOT NULL,
    CONSTRAINT Poziom_jezyka_pk PRIMARY KEY (id)
);

-- Table: Pracownik_administracyjny
CREATE TABLE Pracownik_administracyjny (
    id int  NOT NULL,
    pensja decimal(7,2)  NOT NULL,
    CONSTRAINT Pracownik_administracyjny_pk PRIMARY KEY (id)
);

-- Table: Rola
CREATE TABLE Rola (
    id int  NOT NULL,
    nazwa nvarchar(30)  NOT NULL,
    CONSTRAINT Rola_pk PRIMARY KEY (id)
);

-- Table: Status_zgloszenia
CREATE TABLE Status_zgloszenia (
    id int  NOT NULL AUTO_INCREMENT,
    nazwa nvarchar(50)  NOT NULL,
    CONSTRAINT Status_zgloszenia_pk PRIMARY KEY (id)
);

-- Table: Uczestnictwo
CREATE TABLE Uczestnictwo (
    kursant int  NOT NULL,
    grupa int  NOT NULL,
    liczba_nieobecnosci int  NOT NULL,
    CONSTRAINT Uczestnictwo_pk PRIMARY KEY (kursant,grupa)
);

-- Table: Uzytkownik
CREATE TABLE Uzytkownik (
    id int  NOT NULL AUTO_INCREMENT,
    imie nvarchar(50)  NOT NULL,
    nazwisko nvarchar(50)  NOT NULL,
    email nvarchar(100)  NOT NULL,
    data_urodzenia date  NOT NULL,
    haslo nvarchar(100)  NOT NULL,
    refresh_token nvarchar(200)  NOT NULL,
    rola int  NOT NULL,
    CONSTRAINT Uzytkownik_pk PRIMARY KEY (id)
);

-- Table: Zgloszenie
CREATE TABLE Zgloszenie (
    id int  NOT NULL AUTO_INCREMENT,
    kursant int  NOT NULL,
    grupa int  NOT NULL,
    data_rozpoczecia date  NOT NULL,
    uwagi nvarchar(300)  NULL,
    data_przeslania date  NOT NULL,
    status int  NOT NULL,
    pracownik_rozpatrujacy int  NULL,
    wiadomosc_zwrotna nvarchar(200)  NULL,
    CONSTRAINT Zgloszenie_pk PRIMARY KEY (id)
);

-- Table: Znajomosc_jezyka
CREATE TABLE Znajomosc_jezyka (
    nauczyciel int  NOT NULL,
    jezyk int  NOT NULL,
    poziom int  NOT NULL,
    CONSTRAINT Znajomosc_jezyka_pk PRIMARY KEY (nauczyciel,jezyk)
);

-- foreign keys
-- Reference: Grupa_Jezyk (table: Grupa)
ALTER TABLE Grupa ADD CONSTRAINT Grupa_Jezyk FOREIGN KEY Grupa_Jezyk (jezyk)
    REFERENCES Jezyk (id);

-- Reference: Grupa_Nauczyciel (table: Grupa)
ALTER TABLE Grupa ADD CONSTRAINT Grupa_Nauczyciel FOREIGN KEY Grupa_Nauczyciel (nauczyciel)
    REFERENCES Nauczyciel (id);

-- Reference: Grupa_Poziom_jezyka (table: Grupa)
ALTER TABLE Grupa ADD CONSTRAINT Grupa_Poziom_jezyka FOREIGN KEY Grupa_Poziom_jezyka (poziom)
    REFERENCES Poziom_jezyka (id);

-- Reference: Kursant_Uzytkownik (table: Kursant)
ALTER TABLE Kursant ADD CONSTRAINT Kursant_Uzytkownik FOREIGN KEY Kursant_Uzytkownik (id)
    REFERENCES Uzytkownik (id);

-- Reference: Nauczyciel_Uzytkownik (table: Nauczyciel)
ALTER TABLE Nauczyciel ADD CONSTRAINT Nauczyciel_Uzytkownik FOREIGN KEY Nauczyciel_Uzytkownik (id)
    REFERENCES Uzytkownik (id);

-- Reference: Pracownik_administracyjny_Uzytkownik (table: Pracownik_administracyjny)
ALTER TABLE Pracownik_administracyjny ADD CONSTRAINT Pracownik_administracyjny_Uzytkownik FOREIGN KEY Pracownik_administracyjny_Uzytkownik (id)
    REFERENCES Uzytkownik (id);

-- Reference: Uczestnictwo_Grupa (table: Uczestnictwo)
ALTER TABLE Uczestnictwo ADD CONSTRAINT Uczestnictwo_Grupa FOREIGN KEY Uczestnictwo_Grupa (grupa)
    REFERENCES Grupa (id);

-- Reference: Uczestnictwo_Kursant (table: Uczestnictwo)
ALTER TABLE Uczestnictwo ADD CONSTRAINT Uczestnictwo_Kursant FOREIGN KEY Uczestnictwo_Kursant (kursant)
    REFERENCES Kursant (id);

-- Reference: Uzytkownik_Rola (table: Uzytkownik)
ALTER TABLE Uzytkownik ADD CONSTRAINT Uzytkownik_Rola FOREIGN KEY Uzytkownik_Rola (rola)
    REFERENCES Rola (id);

-- Reference: Zgloszenie_Grupa (table: Zgloszenie)
ALTER TABLE Zgloszenie ADD CONSTRAINT Zgloszenie_Grupa FOREIGN KEY Zgloszenie_Grupa (grupa)
    REFERENCES Grupa (id);

-- Reference: Zgloszenie_Kursant (table: Zgloszenie)
ALTER TABLE Zgloszenie ADD CONSTRAINT Zgloszenie_Kursant FOREIGN KEY Zgloszenie_Kursant (kursant)
    REFERENCES Kursant (id);

-- Reference: Zgloszenie_Pracownik_administracyjny (table: Zgloszenie)
ALTER TABLE Zgloszenie ADD CONSTRAINT Zgloszenie_Pracownik_administracyjny FOREIGN KEY Zgloszenie_Pracownik_administracyjny (pracownik_rozpatrujacy)
    REFERENCES Pracownik_administracyjny (id);

-- Reference: Zgloszenie_Status_zgloszenia (table: Zgloszenie)
ALTER TABLE Zgloszenie ADD CONSTRAINT Zgloszenie_Status_zgloszenia FOREIGN KEY Zgloszenie_Status_zgloszenia (status)
    REFERENCES Status_zgloszenia (id);

-- Reference: Znajomosc_jezyka_Jezyk (table: Znajomosc_jezyka)
ALTER TABLE Znajomosc_jezyka ADD CONSTRAINT Znajomosc_jezyka_Jezyk FOREIGN KEY Znajomosc_jezyka_Jezyk (jezyk)
    REFERENCES Jezyk (id);

-- Reference: Znajomosc_jezyka_Nauczyciel (table: Znajomosc_jezyka)
ALTER TABLE Znajomosc_jezyka ADD CONSTRAINT Znajomosc_jezyka_Nauczyciel FOREIGN KEY Znajomosc_jezyka_Nauczyciel (nauczyciel)
    REFERENCES Nauczyciel (id);

-- Reference: Znajomosc_jezyka_Poziom_jezyka (table: Znajomosc_jezyka)
ALTER TABLE Znajomosc_jezyka ADD CONSTRAINT Znajomosc_jezyka_Poziom_jezyka FOREIGN KEY Znajomosc_jezyka_Poziom_jezyka (poziom)
    REFERENCES Poziom_jezyka (id);

-- End of file.


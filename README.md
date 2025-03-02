# Temat
Tematem projektu jest aplikacja webowa, dla Szkoły Językowa o nazwie "Szkoła Inglisz", prowadzącej kursy językowe w grupach. 

___
# Diagram związków encji
![ERD projektu](LanguageSchool_ERD.png)

___
# Role
W projekcie wyróżniony został podział na 4 główne role:
- **gość** - rola niewymagająca zalogowania się;
- **kursant** - rola przypisywana domyślnie podczas procesu rejestracji dostępnego dla gościa;
- **nauczyciel** - rola opisująca osobę mającą możliwość prowadzenia kursów w grupie. Konto nauczycielskie zostać założone tylko przez pracownika administracyjnego;
- **pracownik administracyjny** - rola praktycznie równoważna z rolą administratora systemu. Kontroluje większość jego zasobów. Jego konto może zostać utworzone tylko przez innego pracownika administracyjnego;

Dla uproszczenia pojawi się też sformułowanie **użytkownik zalogowany**, które oznaczać będzie zbiorczo role **kursanta**, **nauczyciela** i **pracownika administracyjnego**.

___
# Zakres
Poniżej prezentuję listę zaimplementowanych funkcjonalności. Dla ułatwienia zostały one pogrupowane w sekcje względem roli, która ma do danej funkcji dostęp.
## Gość:
- logowanie
- rejestracja jako kursant
- wyświetlenie nauczanych języków
- zmiana języka wyświetlania strony
## Użytkownik zalogowany:
- przeglądanie listy dostępnych kursów
- wyświetlanie szczegółowych informacji dotyczących danego kursu
- wyświetlenie swoich danych osobowych
- edycja swoich danych osobowych
- usunięcie swojego konta w systemie
- wylogowanie się
## Kursant:
- wysłanie zgłoszenia na kurs
- wyświetlanie swoich przesłanych zgłoszeń
- edytowanie swojego przesłanego zgłoszenia, jeśli nie zostało ono jeszcze rozpatrzone
- wycofanie swojego przesłanego zgłoszenia, jeśli nie zostało ono jeszcze rozpatrzone
- wyświetlanie listy kursów na które kursant został przyjęty wraz ze szczegółami (np. liczba nieobecności)
- wyświetlanie w szczegółowym widoku kursu listy swoich zgłoszeń na niego
- możliwość opuszczenia kursu
## Nauczyciel:
- wyświetlanie znanych języków
- wyświetlanie listy prowadzonych przez siebie kursów
- wyświetlanie szczegółów prowadzonego przez siebie kursu, wraz z listą kursantów i liczbą ich nieobecności
- możliwość zmiany liczby nieobecności, każdego z uczniów, którzy należą do grupy prowadzonej przez nauczyciela
## Pracownik administracyjny:
- rozpatrywanie zgłoszeń z opcjonalną informacją zwrotną
- przeglądanie listy wszystkich użytkowników
- wyświetlanie szczegółowego widoku użytkownika
- edycja nieosobistych danych użytkownika
- rejestracja nowego nauczyciela, bądź pracownika administracyjnego w systemie
- usuwanie użytkownika z systemu
- wyświetlanie szczegółów kursu, wraz z listą wszystkich aplikacji na niego oraz listą jego uczestników
- dodawanie nowych kursów
- edycja istniejących kursów
- usuwanie kursów
- usuwanie kursanta z kursu
- przypisywanie znajomości języka dla nauczyciela
- usuwanie znajomości języka dla nauczyciela

___
# Co zostało wykorzystane i jak uruchomić?
## Baza danych
Serwer bazy danych to MySQL w wersji 8.0.40.0 Community Edition. Działa on na domyślnym porcie, czyli `3306`, w związku z czym port nie jest sprecyzowany po stronie backend'u. Określone jest za to:
- działanie serwera na maszynie lokalnej: `localhost`;
- nazwa bazy danych: `language_school`;
- nazwa użytkownika: `root`;
- hasło użytkownika: `admin`;
Wszystkie skrypty SQL oraz diagram encji znajdują się w folderze `sql`, znajdującym bezpośrednio w przesłanym folderze.
## Backend
Backend projektu zrealizowany jest za pomocą node.js wraz z modułem express i innymi popularnymi pakietami, koniecznymi do utworzenia serwera REST API zapewniającego klientom bezpieczną komunikację.
Ze względu na logowanie użytkownika i utrzymywanie informacji o ich sesji, konieczne było utworzenie kluczy do JWT Tokenów, które znajdują się w pliku o ścieżce `./server/.env`, zawierającego zmienne środowiskowe.
Aby uruchomić backend należy otworzyć konsolę w przesłanym katalogu, następnie przejść do katalogu `server` za pomocą polecenia: `cd ./server`, pobrać pakietu wpisując: `npm install`, a następnie uruchomić skrypt korzystając z: `npm run dev`. Na konsoli powinna wyświetlić się informacja o pomyślnym połączeniu z bazą danych (jeśli to takiego dojdzie) oraz komunikat o porcie na jakim serwer nasłuchuje na zapytania (domyślnie jest to port `5000`).
### Informacja dotycząca haseł
**Hasła użytkowników są hashowane za pomocą funkcji bcrypt, co wiąże się z nieprzechowywaniem ich w bazie danych jako czysty tekst, a jako hashe. Dla załączonych insertów hasło dla każdego z użytkowników to `alaALA1!`.**
## Frontend
Frontend został zrealizowany jako Single Page Application (SPA) za pomocą biblioteki React wraz z innymi popularnymi i zgodnymi z nim pakietami. W celu jego uruchomienia, należy uruchomić konsolę w przesłanym katalogu, przejść do katalogu `language-school`, używając `cd ./language-school`, tam należy uruchomić polecenie `npm install`, w celu instalacji wymaganych zależności, a na koniec wpisać w konsolę `npm start`, co finalnie uruchomi frontend aplikacji. Domyślnie działa on na `localhost` na porcie `3000`.
### Notka dotycząca instalacji zależności frontendu
Czasami podczas instalacji zależności dla frontendu, może pojawić się błąd z. W celu jego pozbycia należy uruchomić polecenie `npm install` dopisując po nim `--legacy-peer-deps`. Finalne polecenie powinno wtedy wyglądać w następujący sposób: `npm install --legacy-peer-deps`.
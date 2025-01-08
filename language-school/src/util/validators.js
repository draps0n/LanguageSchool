const validateName = (name) => {
  if (!name) {
    return "Imię nie może być puste";
  }

  if (name.length < 3) {
    return "Imię musi zawierać co najmniej 3 znaki";
  }

  return "";
};

const validateLastName = (lastName) => {
  if (!lastName) {
    return "Naziwsko nie może być puste";
  }

  if (lastName.length < 3) {
    return "Imię musi zawierać co najmniej 3 znaki";
  }

  return "";
};

const validateEmail = (email) => {
  if (!email) {
    return "Adres email jest wymagany";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Proszę podać prawidłowy adres email";
  }

  return "";
};

const validatePassword = (password, isObligatory = false) => {
  if (!isObligatory && !password) {
    return "";
  }

  if (isObligatory && !password) {
    return "Hasło nie może być puste";
  }

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/;
  if (!regex.test(password)) {
    return "Hasło musi zawierać co najmniej 8 znaków, w tym jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny.";
  }

  return "";
};

const validateIfPasswordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Hasła nie są takie same";
  }

  return "";
};

const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) {
    return "Data urodzenia jest wymagana";
  }

  if (new Date(dateOfBirth) > new Date()) {
    return "Data urodzenia nie może być z przyszłości";
  }

  const today = new Date();
  if (
    new Date(dateOfBirth) >
    new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  ) {
    return "Musisz mieć ukończone 18 lat";
  }

  return "";
};

const validateDescription = (description) => {
  if (!description) {
    return "Opis nie może być pusty";
  }

  if (description.length < 10) {
    return "Opis musi zawierać co najmniej 10 znaków";
  }

  if (description.length > 200) {
    return "Opis nie może zawierać więcej niż 200 znaków";
  }

  return "";
};

const validateApplicationStartDate = (startDate) => {
  if (!startDate) {
    return "Data rozpoczęcia jest wymagana";
  }

  const today = new Date();
  const nextMonth = new Date();
  const nextWeek = new Date();

  nextMonth.setMonth(today.getMonth() + 1);
  nextWeek.setDate(today.getDate() + 7);

  const startDateDate = new Date(startDate);
  if (startDateDate > nextMonth || startDateDate < nextWeek) {
    return "Data rozpoczęcia musi być w ciągu najbliższego miesiąca i nie wcześniej niż za tydzień";
  }

  return "";
};

const validateApplicationComment = (message) => {
  if (!message) {
    return "";
  }

  if (message.length < 10 || message.length > 300) {
    return "Uwagi muszą mieć od 10 do 300 znaków";
  }

  return "";
};

const validateGroupPlaces = (places) => {
  if (!places) {
    return "Liczba miejsc jest wymagana";
  }

  if (isNaN(places)) {
    return "Liczba miejsc musi być liczbą";
  }

  if (places < 6) {
    return "Liczba miejsc nie może być mniejsza od 6";
  }

  if (places > 20) {
    return "Liczba miejsc nie może być większa od 20";
  }

  return "";
};

const validateGroupDescription = (description) => {
  if (!description) {
    return "Opis jest wymagany";
  }

  if (description.length < 5) {
    return "Opis musi zawierać co najmniej 5 znaków";
  }

  if (description.length > 250) {
    return "Opis nie może przekraczać 250 znaków";
  }

  return "";
};

const validateGroupPrice = (price) => {
  if (!price) {
    return "Cena jest wymagana";
  }

  if (isNaN(price)) {
    return "Cena musi być liczbą";
  }

  if (price < 0 || price > 1000) {
    return "Cena musi być w przedziale (0, 1000)";
  }

  return "";
};

const validateGroupTeacher = (teacher) => {
  if (!teacher) {
    return "Nauczyciel jest wymagany";
  }

  return "";
};

const validateGroupLanguage = (language) => {
  if (!language) {
    return "Język jest wymagany";
  }

  return "";
};

const validateGroupLevel = (level) => {
  if (!level) {
    return "Poziom jest wymagany";
  }

  return "";
};

const validateGroupDayOfWeek = (day) => {
  if (!day) {
    return "Dzień tygodnia jest wymagany";
  }

  return "";
};

const validateGroupTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return "Godzina rozpoczęcia i zakończenia są wymagane";
  }

  if (startTime >= endTime) {
    return "Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia";
  } else if (endTime <= startTime) {
    return "Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia";
  } else {
    return "";
  }
};

const validateEmployeeSalary = (salary) => {
  if (!salary) {
    return "Wynagrodzenie jest wymagane";
  }

  if (isNaN(salary)) {
    return "Wynagrodzenie musi być liczbą";
  }

  if (salary < 0) {
    return "Wynagrodzenie nie może być ujemne";
  }

  if (salary > 100000) {
    return "Wynagrodzenie nie może przekraczać 100 000";
  }

  return "";
};

const validateApplicationGroup = (groupId) => {
  if (!groupId) {
    return "Grupa jest wymagana";
  }

  return "";
};

export {
  validateName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateIfPasswordsMatch,
  validateDateOfBirth,
  validateDescription,
  validateApplicationStartDate,
  validateApplicationComment,
  validateGroupPlaces,
  validateGroupDescription,
  validateGroupPrice,
  validateGroupTeacher,
  validateGroupLanguage,
  validateGroupLevel,
  validateGroupDayOfWeek,
  validateGroupTime,
  validateEmployeeSalary,
  validateApplicationGroup,
};

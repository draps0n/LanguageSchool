const validateName = (name) => {
  if (!name) {
    return "nameCannotBeEmpty";
  }

  if (name.length < 3 || name.length > 50) {
    return "incorrectNameSize";
  }

  return "";
};

const validateLastName = (lastName) => {
  if (!lastName) {
    return "lastNameCannotBeEmpty";
  }

  if (lastName.length < 3) {
    return "incorrectLastNameSize";
  }

  return "";
};

const validateEmail = (email) => {
  if (!email) {
    return "emailCannotBeEmpty";
  }

  if (email.length < 5 || email.length > 100) {
    return "incorrectEmailSize";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "incorrectEmailFormat";
  }

  return "";
};

const validatePassword = (password, isObligatory = false) => {
  if (!isObligatory && !password) {
    return "";
  }

  if (isObligatory && !password) {
    return "passwordCannotBeEmpty";
  }

  if (password.length < 8 || password.length > 50) {
    return "incorrectPasswordSize";
  }

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/;
  if (!regex.test(password)) {
    return "passwordNotSecure";
  }

  return "";
};

const validateIfPasswordsMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "passwordsDoNotMatch";
  }

  return "";
};

const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) {
    return "dateOfBirthCannotBeEmpty";
  }

  if (new Date(dateOfBirth) > new Date()) {
    return "dateOfBirthInvalid";
  }

  const today = new Date();
  if (
    new Date(dateOfBirth) >
    new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  ) {
    return "atLeast18YearsOld";
  }

  return "";
};

const validateDescription = (description) => {
  if (!description) {
    return "descriptionCannotBeEmpty";
  }

  if (description.length < 10 || description.length > 200) {
    return "incorrectDescriptionSize";
  }

  return "";
};

const validateApplicationStartDate = (startDate) => {
  if (!startDate) {
    return "startDateIsRequired";
  }

  const today = new Date();
  const nextMonth = new Date();
  const nextWeek = new Date();

  nextMonth.setMonth(today.getMonth() + 1);
  nextWeek.setDate(today.getDate() + 7);

  const startDateDate = new Date(startDate);
  if (startDateDate > nextMonth || startDateDate < nextWeek) {
    return "startDateInvalid";
  }

  return "";
};

const validateApplicationComment = (message) => {
  if (!message) {
    return "";
  }

  if (message.length < 10 || message.length > 300) {
    return "incorrectCommentSize";
  }

  return "";
};

const validateGroupPlaces = (places) => {
  if (!places) {
    return "numberOfPlacesRequired";
  }

  if (isNaN(places) || places < 6 || places > 20) {
    return "incorrectNumberOfPlaces";
  }

  return "";
};

const validateGroupDescription = (description) => {
  if (!description) {
    return "descriptionCannotBeEmpty";
  }

  if (description.length < 5 || description.length > 250) {
    return "incorrectGroupDescription";
  }

  return "";
};

const validateGroupPrice = (price) => {
  if (!price) {
    return "priceForClassesRequired";
  }

  if (isNaN(price) || price < 0 || price > 1000) {
    return "incorrectPriceForClasses";
  }

  return "";
};

const validateGroupTeacher = (teacher) => {
  if (!teacher) {
    return "teacherIsRequired";
  }

  return "";
};

const validateGroupLanguage = (language) => {
  if (!language) {
    return "languageIsRequired";
  }

  return "";
};

const validateGroupLevel = (level) => {
  if (!level) {
    return "levelIsRequired";
  }

  return "";
};

const validateGroupDayOfWeek = (day) => {
  if (!day) {
    return "dayOfWeekIsRequired";
  }

  return "";
};

const validateGroupTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return "timeIsRequired";
  }

  if (startTime >= endTime) {
    return "endTimeInvalid";
  } else if (endTime <= startTime) {
    return "startTimeInvalid";
  } else {
    return "";
  }
};

const validateEmployeeSalary = (salary) => {
  if (!salary) {
    return "salaryRequired";
  }

  if (isNaN(salary) || salary < 0 || salary > 100000) {
    return "incorrectSalary";
  }

  return "";
};

const validateApplicationGroup = (groupId) => {
  if (!groupId) {
    return "groupIsRequired";
  }

  return "";
};

const validateFeedbackMessage = (message) => {
  if (!message) {
    return "";
  }

  if (message.length < 10 || message.length > 200) {
    return "feedbackMessageSize";
  }

  return "";
};

const validateTeacherHourlyRate = (hourlyRate) => {
  if (!hourlyRate) {
    return "hourlyRateRequired";
  }

  if (isNaN(hourlyRate) || hourlyRate < 0 || hourlyRate > 1000) {
    return "hourlyRateInvalid";
  }

  return "";
};

const validateTeacherHoursWorked = (hoursWorked) => {
  if (!hoursWorked) {
    return "hoursWorkedRequired";
  }

  if (isNaN(hoursWorked) || hoursWorked < 0 || hoursWorked > 1000) {
    return "incorrectHoursWorked";
  }

  return "";
};

const validateStudentDiscount = (discount) => {
  if (discount === undefined || discount === null) {
    return "discountRequired";
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
  validateFeedbackMessage,
  validateTeacherHourlyRate,
  validateTeacherHoursWorked,
  validateStudentDiscount,
};

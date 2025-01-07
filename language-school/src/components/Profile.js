import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { toast } from "react-toastify";
import {
  validateName,
  validateLastName,
  validateEmail,
  validateDateOfBirth,
  validatePassword,
  validateIfPasswordsMatch,
  validateDescription,
  validateEmployeeSalary,
} from "../util/validators";
import "../styles/Profile.css";
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";

function Profile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const { userData } = useAuth();
  const axios = useAxiosAuth();

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    newPassword: "",
    passwordConfirmation: "",
    description: "",
    hoursWorked: "",
    hourlyRate: "",
    discount: false,
    salary: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    newPassword: "",
    passwordConfirmation: "",
    description: "",
    salary: "",
  });

  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get(`/users/user`);
        const {
          name,
          lastName,
          email,
          dateOfBirth,
          description,
          salary,
          hoursWorked,
          hourlyRate,
          discount,
        } = response.data;
        setFormData({
          name,
          lastName,
          email,
          dateOfBirth: formatDate(dateOfBirth),
          password: "",
          newPassword: "",
          passwordConfirmation: "",
          description,
          hoursWorked,
          hourlyRate,
          discount,
          salary,
        });

        setUser({
          name,
          lastName,
          email,
          dateOfBirth: formatDate(dateOfBirth),
          description,
          salary,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const getTeacherLanguages = async () => {
      try {
        const response = await axios.get(`/teachers/${userData.id}/languages`);
        setLanguages(response.data.languages);
      } catch (error) {
        console.error("Error fetching teacher languages:", error);
      }
    };

    getProfileData();
    if (userData.roleId === roles.TEACHER && userData.id) {
      getTeacherLanguages();
    }
  }, [userData, axios]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setFormData((prev) => ({
      ...prev,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      description: user.description,
      salary: user.salary,
    }));
  };

  const viewMyCourses = () => {
    navigate("/my-courses");
  };

  const viewMyApplications = () => {
    navigate("/my-applications");
  };

  const viewDeleteAccountConfirmation = async () => {
    navigate("profile/delete");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    switch (name) {
      case "name":
        setErrors((prev) => ({
          ...prev,
          [name]: validateName(value),
        }));
        break;
      case "lastName":
        setErrors((prev) => ({
          ...prev,
          [name]: validateLastName(value),
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          [name]: validateEmail(value),
        }));
        break;
      case "newPassword":
        setErrors((prev) => ({
          ...prev,
          newPassword: validatePassword(value, false),
        }));
        break;
      case "passwordConfirmation":
        setErrors((prev) => ({
          ...prev,
          passwordConfirmation: validateIfPasswordsMatch(
            formData.newPassword,
            value
          ),
        }));
        break;
      case "dateOfBirth":
        setErrors((prev) => ({
          ...prev,
          [name]: validateDateOfBirth(value),
        }));
        break;
      case "description":
        setErrors((prev) => ({
          ...prev,
          [name]: validateDescription(value),
        }));
        break;
      case "salary":
        setErrors((prev) => ({
          ...prev,
          [name]: validateEmployeeSalary(value),
        }));
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      validateName(formData.name) ||
      validateLastName(formData.lastName) ||
      validateEmail(formData.email) ||
      validateDateOfBirth(formData.dateOfBirth) ||
      validatePassword(formData.newPassword) ||
      (formData.newPassword &&
        validateIfPasswordsMatch(
          formData.newPassword,
          formData.passwordConfirmation
        )) ||
      (userData.roleId === roles.STUDENT &&
        validateDescription(formData.description)) ||
      (userData.roleId === roles.EMPLOYEE &&
        validateEmployeeSalary(formData.salary))
    ) {
      toast.error("Niepoprawnie wypełniony formularz");
      return;
    }

    const {
      name,
      lastName,
      email,
      dateOfBirth,
      password,
      newPassword,
      description,
      salary,
    } = formData;

    try {
      await axios.put("/users/user", {
        name,
        lastName,
        email,
        dateOfBirth,
        password,
        newPassword,
        description,
        salary,
      });

      setUser({
        name,
        lastName,
        email,
        dateOfBirth,
        description,
        salary,
      });

      setFormData((prev) => ({
        ...prev,
        password: "",
        newPassword: "",
        passwordConfirmation: "",
      }));

      toast.success("Zaktualizowano dane");
      setEditMode(false);
    } catch (error) {
      if (error.response.status === 409) {
        toast.error("Podany adres email jest już zajęty");
      } else if (
        error.response.status === 401 &&
        error?.response?.data?.message
      ) {
        toast.error("Niepoprawne hasło");
      } else {
        toast.error("Wystąpił błąd podczas aktualizacji danych");
      }

      // Resetuj dane w formularzy gdy błąd
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        password: "",
        newPassword: "",
        passwordConfirmation: "",
        description: user.description,
        salary: user.salary,
      }));
      console.error("Error updating user data:", error);
      setEditMode(false);
    }
  };

  if (!user) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="profile-page">
      <form onSubmit={handleFormSubmit}>
        <div className="profile-container">
          <div className="profile-left">
            <h1>Profil użytkownika</h1>
            <p>Witaj! Zalogowano Cię w roli:</p>
            <p className="profile-role-name">
              <strong>{}</strong>
            </p>

            <InputField
              label="Imię"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required={true}
              autoComplete="given-name"
              readOnly={!editMode}
            />

            <InputField
              label="Nazwisko"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required={true}
              autoComplete="family-name"
              readOnly={!editMode}
            />

            <InputField
              label="E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required={true}
              autoComplete="email"
              readOnly={!editMode}
            />

            <InputField
              label="Data urodzenia"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required={true}
              autoComplete="bday"
              readOnly={!editMode}
            />

            <InputField
              label="Hasło"
              type="password"
              name="password"
              value={editMode ? formData.password : "********"}
              onChange={handleChange}
              readOnly={!editMode}
              autoComplete="current-password"
            />

            {editMode && (
              <>
                <InputField
                  label="Nowe hasło"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  autoComplete="new-password"
                />

                <InputField
                  label="Powtórz nowe hasło"
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  error={errors.passwordConfirmation}
                  autoComplete="new-password"
                />
              </>
            )}
          </div>
          <div className="profile-right">
            <img
              src={`/assets/images/user.svg`}
              alt="user-picture"
              className="user-photo"
            />
            {userData.roleId === roles.STUDENT && (
              <div className="student-info">
                <InputTextArea
                  label="Opis"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  placeholder={"Wpisz opis"}
                  rows="7"
                  readOnly={!editMode}
                />

                <InputField
                  label={"Czy przysługuje zniżka"}
                  type="checkbox"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  disabled={true}
                />
              </div>
            )}
            {userData.roleId === roles.TEACHER && (
              <div className="teacher-info">
                <InputField
                  label="Stawka godzinowa (PLN)"
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate || ""}
                  readOnly
                />

                <InputField
                  label="Przepracowane godziny"
                  name="hoursWorked"
                  type="number"
                  value={formData.hoursWorked || ""}
                  readOnly
                />
              </div>
            )}
            {userData.roleId === roles.EMPLOYEE && (
              <div className="employee-info">
                <InputField
                  label="Pensja"
                  name="salary"
                  type="number"
                  onChange={handleChange}
                  value={formData.salary || ""}
                  readOnly={!editMode}
                />
              </div>
            )}
          </div>
        </div>
        <div className="profile-buttons">
          <button onClick={toggleEditMode} type="button">
            {editMode ? "Anuluj" : "Edytuj"}
          </button>
          {editMode && <button type="submit">Zapisz</button>}
          {editMode && (
            <button onClick={viewDeleteAccountConfirmation} type="button">
              Usuń konto
            </button>
          )}
          {!editMode &&
            (userData.roleId === roles.STUDENT ||
              userData.roleId === roles.TEACHER) && (
              <button onClick={viewMyCourses} type="button">
                Moje kursy
              </button>
            )}
          {!editMode && userData.roleId === roles.STUDENT && (
            <button onClick={viewMyApplications} type="button">
              Moje zgłoszenia
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;

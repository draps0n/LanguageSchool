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

  const [formData, setFormData] = useState({
    name: userData.name,
    lastName: userData.lastName,
    email: userData.email,
    dateOfBirth: userData.dateOfBirth ? formatDate(userData.dateOfBirth) : "",
    password: "",
    newPassword: "",
    passwordConfirmation: "",
    description: userData.description,
    salary: userData.salary,
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
    const getTeacherLanguages = async () => {
      try {
        const response = await axios.get(`/teachers/${userData.id}/languages`);
        setLanguages(response.data.languages);
      } catch (error) {
        console.error("Error fetching teacher languages:", error);
      }
    };

    if (userData.role.id === roles.TEACHER && userData.id) {
      getTeacherLanguages();
    }
  }, [userData, axios]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
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
          newPassword: validatePassword(value),
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
    }
  };

  const handleFormSubmit = async (e) => {
    // TODO: edycja profilu
    e.preventDefault();

    toast.error("Funkcjonalność w przygotowaniu");
  };

  return (
    <div className="profile-page">
      <form onSubmit={handleFormSubmit}>
        <div className="profile-container">
          <div className="profile-left">
            <h1>Profil użytkownika</h1>
            <p>Witaj! Zalogowano Cię w roli:</p>
            <p className="profile-role-name">
              <strong>{userData.role.name}</strong>
            </p>
            <label htmlFor="name">Imię:</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!editMode}
              autoComplete="given-name"
            ></input>
            {errors.name && <p className="error">{errors.name}</p>}

            <label htmlFor="lastName">Nazwisko:</label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!editMode}
              autoComplete="family-name"
            ></input>
            {errors.lastName && <p className="error">{errors.lastName}</p>}

            <label htmlFor="email">E-mail:</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!editMode}
              autoComplete="email"
            ></input>
            {errors.email && <p className="error">{errors.email}</p>}

            <label htmlFor="dateOfBirth">Data urodzenia:</label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              readOnly={!editMode}
              autoComplete="bday"
            ></input>
            {errors.dateOfBirth && (
              <p className="error">{errors.dateOfBirth}</p>
            )}

            <label htmlFor="password">Hasło:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={editMode ? formData.password : "********"}
              onChange={handleChange}
              readOnly={!editMode}
              autoComplete="email"
            ></input>

            {editMode && (
              <>
                <label htmlFor="newPassword">Nowe hasło:</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  autoComplete="new-password"
                  onChange={handleChange}
                ></input>
                {errors.newPassword && (
                  <p className="error">{errors.newPassword}</p>
                )}

                <label htmlFor="passwordConfirmation">
                  Powtórz nowe hasło:
                </label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  autoComplete="new-password"
                  onChange={handleChange}
                ></input>
                {errors.passwordConfirmation && (
                  <p className="error">{errors.passwordConfirmation}</p>
                )}
              </>
            )}
          </div>
          <div className="profile-right">
            <img
              src={`/assets/images/user.svg`}
              alt="user-picture"
              className="user-photo"
            />
            {userData.role.id === roles.STUDENT && (
              <div className="student-info">
                <label htmlFor="description">Opis:</label>
                <textarea
                  value={formData.description}
                  readOnly={!editMode}
                  id="description"
                  name="description"
                  onChange={handleChange}
                ></textarea>
                {errors.description && (
                  <p className="error">{errors.description}</p>
                )}

                <label htmlFor="discount">Czy przysługuje zniżka:</label>
                <input
                  id="discount"
                  name="discount"
                  type="checkbox"
                  value={formData.discount}
                  disabled
                ></input>
              </div>
            )}
            {userData.role.id === roles.TEACHER && (
              <div className="teacher-info">
                <label htmlFor="hourlyRate">Stawka godzinowa:</label>
                <input
                  id="hourlyRate"
                  value={userData.hourlyRate || ""}
                  readOnly
                ></input>
                <label htmlFor="hoursWorked">Przepracowane godziny:</label>
                <input
                  id="hoursWorked"
                  type="number"
                  value={userData.hoursWorked || ""}
                  readOnly
                ></input>
              </div>
            )}
            {userData.role.id === roles.EMPLOYEE && (
              <div className="employee-info">
                <label htmlFor="salary">Pensja:</label>
                <input
                  id="salary"
                  name="salary"
                  value={formData.salary || ""}
                  readOnly={!editMode}
                ></input>
                {errors.salary && <p className="error">{errors.salary}</p>}
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
            (userData.role.id === roles.STUDENT ||
              userData.role.id === roles.TEACHER) && (
              <button onClick={viewMyCourses} type="button">
                Moje kursy
              </button>
            )}
          {!editMode && userData.role.id === roles.STUDENT && (
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

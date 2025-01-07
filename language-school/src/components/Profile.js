import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import useAxiosAuth from "../hooks/useAxiosAuth";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const { userData } = useAuth();
  const axios = useAxiosAuth();

  const [formData, setFormData] = useState({
    name: userData.name,
    lastName: userData.lastName,
    email: userData.email,
    description: userData.description,
    password: "",
    newPassword: "",
    passwordConfirmation: "",
    hourlyRate: userData.hourlyRate,
    hoursWorked: userData.hoursWorked,
    salary: userData.salary,
  });

  const [errors, setErrors] = useState({
    name: userData.name,
    lastName: userData.lastName,
    email: userData.email,
    description: userData.description,
    password: "",
    newPassword: "",
    passwordConfirmation: "",
    hourlyRate: userData.hourlyRate,
    hoursWorked: userData.hoursWorked,
    salary: userData.salary,
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

    if (userData.role.id === roles.TEACHER) {
      getTeacherLanguages();
    }
  }, [userData]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const viewMyCourses = () => {
    navigate("/my-courses");
  };

  const viewDeleteAccountConfirmation = async () => {
    navigate("profile/delete");
  };

  const handleChange = (e) => {
    // TODO: chyba nie działa
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    // TODO: edycja profilu
    e.preventDefault();
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
              value={formData.name}
              readOnly={!editMode}
              autoComplete="given-name"
            ></input>
            <label htmlFor="lastName">Nazwisko:</label>
            <input
              id="lastName"
              value={formData.lastName}
              readOnly={!editMode}
              autoComplete="family-name"
            ></input>
            <label htmlFor="email">E-mail:</label>
            <input
              id="email"
              value={formData.email}
              readOnly={!editMode}
              autoComplete="email"
            ></input>
            <label htmlFor="password">Hasło:</label>
            <input
              id="password"
              type="password"
              value={editMode ? formData.password : "********"}
              readOnly={!editMode}
              autoComplete="email"
            ></input>
            {editMode && (
              <>
                <label htmlFor="newPassword">Nowe hasło:</label>
                <input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  autoComplete="new-password"
                  onChange={handleChange}
                ></input>
                <label htmlFor="passwordConfirmation">
                  Powtórz nowe hasło:
                </label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  value={formData.passwordConfirmation}
                  autoComplete="new-password"
                  onChange={handleChange}
                ></input>
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
                ></textarea>
              </div>
            )}
            {userData.role.id === roles.TEACHER && (
              <div className="teacher-info">
                <label htmlFor="hourlyRate">Stawka godzinowa:</label>
                <input
                  id="hourlyRate"
                  value={formData.hourlyRate || ""}
                  readOnly={!editMode}
                ></input>
                <label htmlFor="hoursWorked">Przepracowane godziny:</label>
                <input
                  id="hoursWorked"
                  value={formData.hoursWorked || ""}
                  readOnly={!editMode}
                ></input>
              </div>
            )}
            {userData.role.id === roles.EMPLOYEE && (
              <div className="employee-info">
                <label htmlFor="salary">Pensja:</label>
                <input
                  id="salary"
                  value={formData.salary || ""}
                  readOnly={!editMode}
                ></input>
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
        </div>
      </form>
    </div>
  );
}

export default Profile;

import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import "../styles/Profile.css";

function Profile() {
  const { editMode, setEditMode } = useState(false);
  const { userData } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-left">
        <h1>Profil użytkownika</h1>
        <label htmlFor="name">Imię:</label>
        <input
          id="name"
          value={userData.name}
          readOnly={!editMode}
          autoComplete="given-name"
        ></input>
        <label htmlFor="lastName">Nazwisko:</label>
        <input
          id="lastName"
          value={userData.lastName}
          readOnly={!editMode}
          autoComplete="family-name"
        ></input>
        <label htmlFor="email">E-mail:</label>
        <input
          id="email"
          value={userData.email}
          readOnly={!editMode}
          autoComplete="email"
        ></input>
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
              value={userData.description}
              readOnly={!editMode}
              id="description"
            ></textarea>
          </div>
        )}
        {userData.role.id === roles.TEACHER && (
          <div className="teacher-info">
            <label htmlFor="description">Opis:</label>
            <textarea
              value={userData.description}
              readOnly={!editMode}
              id="description"
            ></textarea>
          </div>
        )}
        {userData.role.id === roles.EMPLOYEE && (
          <div className="employee-info">
            <label htmlFor="description">Opis:</label>
            <textarea
              value={userData.description}
              readOnly={!editMode}
              id="description"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import "../styles/Profile.css";

function Profile() {
  const { editMode, setEditMode } = useState(false);
  const { userData } = useAuth();
  return (
    <div className="profile-container">
      <div className="profile-left">
        <h1>Profil użytkownika</h1>
        <label htmlFor="name">Imię:</label>
        <input id="name" value={userData.name} readOnly={!editMode}></input>
        <label htmlFor="lastName">Nazwisko:</label>
        <input
          id="lastName"
          value={userData.lastName}
          readOnly={!editMode}
        ></input>
        <label htmlFor="email">E-mail:</label>
        <input id="email" value={userData.email} readOnly={!editMode}></input>
      </div>
      <div className="profile-right">
        <img
          src={`/assets/images/user.svg`}
          alt="user-picture"
          className="user-photo"
        />
        <label htmlFor="description">Opis:</label>
        <textarea readOnly={!editMode}>{userData.description}</textarea>
      </div>
    </div>
  );
}

export default Profile;

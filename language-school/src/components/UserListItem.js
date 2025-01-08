import React from "react";
import "../styles/UserListItem.css";
import { useNavigate } from "react-router-dom";
import roles from "../constants/roles";

function UserListItem({ user }) {
  const navigate = useNavigate();

  const viewUserDetails = () => {
    navigate(`/admin/users/${user.id}`);
  };

  return (
    <div
      className={
        "user-card " +
        (user.role.id === roles.EMPLOYEE
          ? "employee-card"
          : user.role.id === roles.TEACHER
          ? "teacher-card"
          : "student-card")
      }
      onClick={viewUserDetails}
    >
      <img
        src={`/assets/images/user.svg`}
        alt="user-picture"
        className="user-photo"
      />
      <div className="user-info">
        <p className="info-item">
          <span className="label">Imię:</span> {user.name}
        </p>
        <p className="info-item">
          <span className="label">Nazwisko:</span> {user.lastName}
        </p>
        <p className="info-item">
          <span className="label">Email:</span> {user.email}
        </p>
        <p className="info-item">
          <span className="label">Rola:</span> {user.role.name}
        </p>
        <br />
      </div>
    </div>
  );
}

export default UserListItem;

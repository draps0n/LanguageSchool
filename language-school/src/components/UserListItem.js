import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import roles from "../constants/roles";

function UserListItem({ user }) {
  const { t } = useTranslation();
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
          <span className="label">{t("firstName")}:</span> {user.name}
        </p>
        <p className="info-item">
          <span className="label">{t("lastName")}:</span> {user.lastName}
        </p>
        <p className="info-item">
          <span className="label">{t("email")}:</span> {user.email}
        </p>
        <p className="info-item">
          <span className="label">{t("role")}:</span> {t(user.role.name)}
        </p>
        <br />
      </div>
    </div>
  );
}

export default UserListItem;

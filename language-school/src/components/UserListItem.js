import React from "react";
import "../styles/UserListItem.css";
import { useNavigate } from "react-router-dom";

function UserListItem({ user }) {
  const navigate = useNavigate();

  const viewUserDetails = () => {
    navigate(`/admin/users/${user.id}`);
  };

  return (
    <div className="user-card" onClick={viewUserDetails}>
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

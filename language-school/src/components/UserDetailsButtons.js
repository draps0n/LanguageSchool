import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaAngleLeft } from "react-icons/fa";
import "../styles/UserDetailsButtons.css";

function UserDetailsButtons({ userId }) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleDelete = () => {
    // TODO: Usuń użytkownika
  };

  return (
    <div className="user-details-buttons">
      <button className="user-details-button standard-button" onClick={goBack}>
        <FaAngleLeft className="icon" /> Wróć
      </button>
      <button className="user-details-button edit-button" onClick={handleEdit}>
        Edytuj <FaEdit className="icon" />
      </button>
      <button
        className="user-details-button delete-button"
        onClick={handleDelete}
      >
        Usuń <FaTrash className="icon" />
      </button>
    </div>
  );
}

export default UserDetailsButtons;

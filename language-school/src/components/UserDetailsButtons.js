import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaAngleLeft } from "react-icons/fa";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import "../styles/UserDetailsButtons.css";

function UserDetailsButtons({ userId }) {
  const navigate = useNavigate();
  const axios = useAxiosAuth();
  const { userData } = useAuth();

  const goBack = () => {
    navigate("/admin/users");
  };

  const handleEdit = () => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleDelete = async () => {
    try {
      if (userId === userData.userId) {
        toast.error(
          "Nie możesz tu usunąć swojego konta. Aby to zrobić przejdź do swojego profilu."
        );
        return;
      }

      await axios.delete(`/users/${userId}`);
      toast.success("Użytkownik został usunięty");
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      if (error.response.status === 409) {
        toast.error("Ten nauczyciel prowadzi zajęcia. Nie możesz go usunąć.");
      } else {
        toast.error("Nie udało się usunąć użytkownika");
      }
    }
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
        disabled={userId === userData.userId}
        title={
          userId === userData.userId
            ? "Nie możesz tu usunąć swojego konta, aby to zrobić przejdź do swojego profilu"
            : ""
        }
      >
        Usuń <FaTrash className="icon" />
      </button>
    </div>
  );
}

export default UserDetailsButtons;

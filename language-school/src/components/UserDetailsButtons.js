import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaAngleLeft } from "react-icons/fa";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import "../styles/UserDetailsButtons.css";

function UserDetailsButtons({ userId }) {
  const { t } = useTranslation();
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
        toast.error(t("toDeleteAccountVisitProfile"));
        return;
      }

      await axios.delete(`/users/${userId}`);
      toast.success(t("userDeleted"));
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      if (error.response.status === 409) {
        toast.error(t("cannotDeleteTeacherGroup"));
      } else {
        toast.error(t("userDeleteError"));
      }
    }
  };

  return (
    <div className="user-details-buttons">
      <button className="user-details-button standard-button" onClick={goBack}>
        <FaAngleLeft className="icon" /> {t("goBack")}
      </button>
      <button className="user-details-button edit-button" onClick={handleEdit}>
        {t("edit")} <FaEdit className="icon" />
      </button>
      <button
        className="user-details-button delete-button"
        onClick={handleDelete}
        disabled={userId === userData.userId}
        title={
          userId === userData.userId ? t("toDeleteAccountVisitProfile") : ""
        }
      >
        {t("delete")} <FaTrash className="icon" />
      </button>
    </div>
  );
}

export default UserDetailsButtons;

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan, FaPen, FaUserPlus } from "react-icons/fa6";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import "../styles/CourseDetailsButtonPanel.css";
import BackButton from "./BackButton";
import { useTranslation } from "react-i18next";

const CourseDetailsButtonPanel = ({ isMember }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { userData } = useAuth();

  const joinGroup = () => {
    navigate("apply");
  };

  const editGroup = () => {
    navigate("edit");
  };

  const deleteGroup = () => {
    navigate("delete");
  };

  return (
    <div className="button-panel">
      <BackButton />
      {userData.roleId === roles.STUDENT && !isMember && (
        <button onClick={joinGroup} className="small-button">
          <FaUserPlus className="icon" />
          {t("join")}
        </button>
      )}
      {userData.roleId === roles.EMPLOYEE && (
        <div>
          <button onClick={editGroup} className="small-button">
            <FaPen className="icon" />
            {t("edit")}
          </button>
          <button onClick={deleteGroup} className="small-button delete-button">
            <FaRegTrashCan className="icon" />
            {t("delete")}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsButtonPanel;

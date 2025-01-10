import React, { useState } from "react";
import roles from "../constants/roles";
import useAuth from "../hooks/useAuth";
import InputTextArea from "./InputTextArea";
import { useNavigate } from "react-router-dom";
import applicationStates from "../constants/applicationStates";
import ApplicationListItemStudentButtons from "./ApplicationListItemStudentButtons";
import { FaEye } from "react-icons/fa";
import "../styles/ApplicationListItem.css";
import { useTranslation } from "react-i18next";
import ApplicationListItemEmployeeButtons from "./ApplicationListItemEmployeeButtons";

const ApplicationListItem = ({ application, refreshApplications }) => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Funkcja do obsługi kliknięcia na grupę
  const viewGroup = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <div
      className={
        "application-list-item " +
        (application.status.id === applicationStates.REJECTED
          ? "rejected-application"
          : application.status.id === applicationStates.ACCEPTED
          ? "accepted-application"
          : application.status.id === applicationStates.PENDING
          ? "pending-application"
          : "")
      }
    >
      <div className="application-summary">
        <p>
          <strong>{t("groupCode")}:</strong> {application.language.code}-
          {application.groupId}
        </p>
        <p>
          <strong>{t("status")}:</strong> {t(application.status.name)}
        </p>
      </div>
      <div className={`application-details ${showDetails ? "open" : ""}`}>
        <p>
          <strong>{t("language")}:</strong> {t(application.language.name)}
        </p>
        <p>
          <strong>{t("level")}:</strong> {application.level.name}
        </p>
        <p>
          <strong>{t("preferredStartDate")}:</strong>{" "}
          {new Date(application.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>{t("sendDate")}:</strong>{" "}
          {new Date(application.sentDate).toLocaleDateString()}
        </p>
        <p>
          <strong>{t("comments")}:</strong> {application.comment || "-"}
        </p>
        {((application.feedbackMessage && userData.roleId === roles.STUDENT) ||
          (application.feedbackMessage &&
            userData.roleId === roles.EMPLOYEE &&
            application.status.id !== applicationStates.PENDING)) && (
          <InputTextArea
            label={t("feedbackMessage")}
            value={application.feedbackMessage}
            readOnly={true}
          />
        )}
        {userData.roleId === roles.STUDENT && (
          <ApplicationListItemStudentButtons
            application={application}
            viewGroup={viewGroup}
            refreshApplications={refreshApplications}
          />
        )}
        {userData.roleId === roles.EMPLOYEE && (
          <ApplicationListItemEmployeeButtons
            application={application}
            viewGroup={viewGroup}
            refreshApplications={refreshApplications}
          />
        )}
        <div></div>
      </div>
      <div className="show-details-button-container">
        <button
          className="application-details-button standard-button"
          onClick={toggleDetails}
          title={t("showDetails")}
        >
          <FaEye className="icon" />
        </button>
      </div>
    </div>
  );
};

export default ApplicationListItem;

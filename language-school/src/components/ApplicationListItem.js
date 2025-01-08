import React, { useState } from "react";
import roles from "../constants/roles";
import useAuth from "../hooks/useAuth";
import InputTextArea from "./InputTextArea";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { useNavigate } from "react-router-dom";
import applicationStates from "../constants/applicationStates";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaEye,
  FaTimesCircle,
  FaEdit,
  FaUsers,
} from "react-icons/fa";
import "../styles/ApplicationListItem.css";

const ApplicationListItem = ({ application, refreshApplications }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const axios = useAxiosAuth();

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Funkcja do obsługi kliknięcia na grupę
  const viewGroup = (id) => {
    navigate(`/courses/${id}`);
  };

  const viewEditApplication = () => {
    navigate(`/my-applications/${application.id}/edit`);
  };

  const cancelApplication = async (applicationId) => {
    try {
      await axios.delete(`/applications/${applicationId}`);
      await refreshApplications();
      toast.success("Zgłoszenie zostało wycofane.");
    } catch (error) {
      console.error("Error while cancelling application: ", error);
      toast.error("Wystąpił błąd podczas wycofywania zgłoszenia.");
    }
  };

  return (
    <div className="application-list-item">
      <div className="application-summary">
        <p>
          <strong>Kod grupy:</strong> {application.language.code}-
          {application.groupId}
        </p>
        <p>
          <strong>Status:</strong> {application.status.name}
        </p>
      </div>
      <div className={`application-details ${showDetails ? "open" : ""}`}>
        <p>
          <p>
            <strong>Język:</strong> {application.language.name}
          </p>
          <p>
            <strong>Poziom:</strong> {application.level.name}
          </p>
          <p>
            <strong>Data rozpoczęcia:</strong>{" "}
            {new Date(application.startDate).toLocaleDateString()}
          </p>
          <strong>Data przesłania:</strong>{" "}
          {new Date(application.sentDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Uwagi:</strong> {application.comment || "-"}
        </p>
        {application.feedbackMessage && (
          <InputTextArea
            label="Wiadomość zwrotna"
            value={application.feedbackMessage}
            readOnly={true}
          />
        )}
        <div className="application-details-extra-buttons-container">
          <button
            className="application-details-button standard-button"
            onClick={() => viewGroup(application.groupId)}
            title="Zobacz grupę"
          >
            <FaUsers className="icon" />
          </button>
          {userData.roleId === roles.STUDENT &&
            application.status.id === applicationStates.PENDING && (
              <>
                <button
                  className="application-details-button edit-button"
                  title="Edytuj"
                  onClick={viewEditApplication}
                >
                  <FaEdit className="icon" />
                </button>
                <button
                  className="application-details-button delete-button"
                  title="Wycofaj"
                  onClick={() => cancelApplication(application.id)}
                >
                  <FaTimesCircle className="icon" />
                </button>
              </>
            )}
          {userData.roleId === roles.EMPLOYEE &&
            application.status.id === applicationStates.PENDING && (
              <>
                <button
                  className="application-details-button edit-button"
                  title="Zaakceptuj"
                >
                  <FaCheckCircle className="icon" />
                </button>
                <button
                  className="application-details-button delete-button"
                  title="Odrzuć"
                >
                  <FaTimesCircle className="icon" />
                </button>
              </>
            )}
        </div>
      </div>
      <div className="show-details-button-container">
        <button
          className="application-details-button standard-button"
          onClick={toggleDetails}
        >
          <FaEye className="icon" />
        </button>
      </div>
    </div>
  );
};

export default ApplicationListItem;

import React from "react";
import { FaTimesCircle, FaUsers, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import applicationStates from "../constants/applicationStates";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { useTranslation } from "react-i18next";

function ApplicationListItemStudentButtons({
  application,
  viewGroup,
  refreshApplications,
}) {
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const navigate = useNavigate();

  const viewEditApplication = () => {
    navigate(`/my-applications/${application.id}/edit`);
  };

  const cancelApplication = async (applicationId) => {
    try {
      await axios.delete(`/applications/${applicationId}`);
      await refreshApplications();
      toast.success(t("applicationWithdrawn"));
    } catch (error) {
      console.error("Error while cancelling application: ", error);
      toast.error(t("applicationWithdrawError"));
    }
  };

  return (
    <div className="application-details-extra-buttons-container">
      <button
        className="application-details-button standard-button"
        onClick={() => viewGroup(application.groupId)}
        title={t("viewGroup")}
      >
        <FaUsers className="icon" />
      </button>
      {application.status.id === applicationStates.PENDING && (
        <>
          <button
            className="application-details-button edit-button"
            title={t("edit")}
            onClick={viewEditApplication}
          >
            <FaEdit className="icon" />
          </button>
          <button
            className="application-details-button delete-button"
            title={t("withdraw")}
            onClick={() => cancelApplication(application.id)}
          >
            <FaTimesCircle className="icon" />
          </button>
        </>
      )}
    </div>
  );
}

export default ApplicationListItemStudentButtons;

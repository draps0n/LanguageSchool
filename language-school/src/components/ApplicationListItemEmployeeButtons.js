import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaUsers } from "react-icons/fa";
import applicationStates from "../constants/applicationStates";
import InputTextArea from "./InputTextArea";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { validateFeedbackMessage } from "../util/validators";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function ApplicationListItemEmployeeButtons({
  application,
  viewGroup,
  refreshApplications,
  shouldShowGroup,
}) {
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const [feedbackMessage, setFeedbackMessage] = useState(
    application.feedbackMessage || ""
  );

  const [feedbackMessageError, setFeedbackMessageError] = useState("");

  const hadleChange = (e) => {
    setFeedbackMessage(e.target.value);

    setFeedbackMessageError(validateFeedbackMessage(e.target.value));
  };

  const handleSubmit = async (e, newStatus) => {
    e.preventDefault();

    if (validateFeedbackMessage(feedbackMessage)) {
      toast.error(t("formContainsErrors"));
      return;
    }

    const toSend = {
      newStatus: newStatus,
      feedbackMessage: feedbackMessage,
    };

    try {
      const response = await axios.put(
        `/applications/${application.id}/review`,
        toSend
      );

      if (response.status === 204) {
        refreshApplications();
        toast.success(t("applicationReviewed"));
      } else {
        throw new Error("Error");
      }
    } catch (error) {
      console.error("Error while updating application: ", error);
      toast.error(t("applicationReviewError"));
    }
  };

  return (
    <form>
      {application.status.id === applicationStates.PENDING && (
        <>
          <InputTextArea
            label={t("feedbackMessage")}
            name={"feedbackMessage"}
            rows={"6"}
            value={feedbackMessage}
            onChange={hadleChange}
            error={feedbackMessageError}
          />
        </>
      )}
      <div className="application-details-extra-buttons-container">
        {shouldShowGroup && (
          <button
            className="application-details-button standard-button"
            onClick={() => viewGroup(application.groupId)}
            title={t("viewGroup")}
          >
            <FaUsers className="icon" />
          </button>
        )}
        {application.status.id === applicationStates.PENDING && (
          <>
            <button
              className="application-details-button edit-button"
              title={t("accept")}
              type="submit"
              onClick={(e) => handleSubmit(e, applicationStates.ACCEPTED)}
            >
              <FaCheckCircle className="icon" />
            </button>
            <button
              className="application-details-button delete-button"
              title={t("reject")}
              type="submit"
              onClick={(e) => handleSubmit(e, applicationStates.REJECTED)}
            >
              <FaTimesCircle className="icon" />
            </button>
          </>
        )}
      </div>
    </form>
  );
}

export default ApplicationListItemEmployeeButtons;

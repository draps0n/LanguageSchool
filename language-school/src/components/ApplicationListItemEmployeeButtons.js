import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaUsers } from "react-icons/fa";
import applicationStates from "../constants/applicationStates";
import InputTextArea from "./InputTextArea";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { validateFeedbackMessage } from "../util/validators";
import { toast } from "react-toastify";

function ApplicationListItemEmployeeButtons({
  application,
  viewGroup,
  refreshApplications,
}) {
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
      toast.error("W formularzu występują błędy");
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
      console.log(response.data);

      if (response.status === 204) {
        refreshApplications();
        toast.success("Zgłoszenie zostało rozpatrzone.");
      } else {
        throw new Error("Error");
      }
    } catch (error) {
      console.error("Error while updating application: ", error);
      toast.error("Wystąpił błąd podczas rozpatrywania zgłoszenia.");
    }
  };

  return (
    <form>
      {application.status.id === applicationStates.PENDING && (
        <>
          <InputTextArea
            label="Wiadomość zwrotna"
            name={"feedbackMessage"}
            rows={"6"}
            value={feedbackMessage}
            onChange={hadleChange}
            error={feedbackMessageError}
          />
        </>
      )}
      <div className="application-details-extra-buttons-container">
        <button
          className="application-details-button standard-button"
          onClick={() => viewGroup(application.groupId)}
          title="Zobacz grupę"
          type="button"
        >
          <FaUsers className="icon" />
        </button>
        {application.status.id === applicationStates.PENDING && (
          <>
            <button
              className="application-details-button edit-button"
              title="Zaakceptuj"
              type="submit"
              onClick={(e) => handleSubmit(e, applicationStates.ACCEPTED)}
            >
              <FaCheckCircle className="icon" />
            </button>
            <button
              className="application-details-button delete-button"
              title="Odrzuć"
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

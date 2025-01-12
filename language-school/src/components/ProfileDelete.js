import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function ProfileDelete() {
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  const [generalError, setGeneralError] = useState("");

  const deleteProfile = async () => {
    try {
      const response = await axios.delete("/users/profile");

      if (response.status === 200) {
        setUserData(null);
        toast.success(t("accountDeleted"));
        navigate("/");
      } else {
        throw new Error(t("accountDeleteError"));
      }
    } catch (error) {
      if (error.response.status === 409) {
        toast.error(t("cannotDeleteAccountCourses"));
        navigate("/profile");
      } else {
        toast.error(t("accountDeleteError"));
        setGeneralError(t("accountDeleteError"));
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h2>{t("accountDeleteQuestion")}</h2>
      {generalError && <p className="error">{generalError}</p>}
      <div className="button-panel">
        <button onClick={deleteProfile} className="small-button delete-button">
          {t("delete")}
        </button>
        <button onClick={goBack} className="small-button">
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default ProfileDelete;

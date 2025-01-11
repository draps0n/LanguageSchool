import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function CourseDeleteConfirmation() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { id } = useParams();

  const axios = useAxiosAuth();

  const goBack = () => {
    navigate(-1);
  };

  const deleteCourse = async () => {
    try {
      await axios.delete(`/groups/${id}`);
      toast.success(t("courseDeleted"));
      navigate("/courses");
    } catch (error) {
      toast.error(t("courseDeleteError") + " " + t("tryAgainLater"));
    }
  };

  return (
    <div>
      <h2>{t("deleteCourseQuestion")}</h2>
      <p>{t("deleteCourseAdditionalInfo")}</p>
      <div className="button-panel">
        <button onClick={deleteCourse} className="small-button delete-button">
          {t("delete")}
        </button>
        <button onClick={goBack} className="small-button">
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default CourseDeleteConfirmation;

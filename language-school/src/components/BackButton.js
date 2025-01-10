import React from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

function BackButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <button className="small-button" onClick={goBack} type="button">
      <FaAngleLeft className="icon" />
      {t("goBack")}
    </button>
  );
}

export default BackButton;

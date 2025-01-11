import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Forbidden = () => {
  const { t } = useTranslation();

  // Hook do nawigacji
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Forbidden</h1>
      <p>{t("forbiddenMessage")}</p>
      <br />
      <button className="error-button" onClick={() => navigate(-1)}>
        {t("goBack")}
      </button>
    </div>
  );
};

export default Forbidden;

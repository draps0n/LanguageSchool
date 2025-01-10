import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Error.css";

const NotFound = () => {
  const { t } = useTranslation();

  // Hook do nawigacji
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Not Found</h1>
      <p>{t("notFoundMessage")}</p>
      <br />
      <button className="error-button" onClick={() => navigate(-1)}>
        {t("goBack")}
      </button>
    </div>
  );
};

export default NotFound;

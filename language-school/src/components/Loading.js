import React from "react";
import { useTranslation } from "react-i18next";

function Loading({ error }) {
  const { t } = useTranslation();
  return (
    <div>
      {error ? <p className="error">{error}</p> : <p>{t("loading")}...</p>}
    </div>
  );
}

export default Loading;

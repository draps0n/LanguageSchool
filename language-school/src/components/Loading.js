import React from "react";
import { useTranslation } from "react-i18next";

function Loading() {
  const { t } = useTranslation();
  return <div>{t("loading")}...</div>;
}

export default Loading;

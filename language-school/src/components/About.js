import React from "react";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <h1>{t("about")}</h1>
      <p>{t("aboutWelcome")}</p>
      <br />

      <h2>{t("howWeTeach")}</h2>
      <p>{t("aboutHowWeTeach")}</p>
      <br />

      <h2>{t("ourStory")}</h2>
      <p>{t("aboutOurStory")}</p>
      <br />

      <h2>{t("whyUs")}</h2>
      <p>
        {t("aboutWhyUs")}
        <ul>
          <li>{t("aboutWhyUs1")}</li>
          <li>{t("aboutWhyUs2")}</li>
          <li>{t("aboutWhyUs3")}</li>
          <li>{t("aboutWhyUs4")}</li>
          <li>{t("aboutWhyUs5")}</li>
        </ul>
      </p>
      <br />

      <p>{t("joinUs")}</p>
    </div>
  );
}

export default About;

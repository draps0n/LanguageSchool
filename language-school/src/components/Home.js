import React from "react";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      <h1>{t("languageSchool")}</h1>
      <p>{t("welcomeMessage")}</p>
      <section className="about-section">
        <h2>{t("about")}</h2>
        <p>{t("schoolDescription")}</p>
      </section>
      <section className="courses-section">
        <h2>{t("toughtLanguages")}</h2>
        <ul>
          <li>Kursy angielskiego</li>
          <li>Kursy niemieckiego</li>
          <li>Kursy hiszpańskiego</li>
          <li>Kursy francuskiego</li>
          <li>Kursy włoskiego</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;

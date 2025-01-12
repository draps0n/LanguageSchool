import React from "react";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      <h1>{t("contactPage")}</h1>
      <section className="contact-section">
        <p>{t("contactDescription")}</p>
        <br />
        <h2>{t("contact")}</h2>
        <p>
          {t("schoolAddress")}
          <br />
          {t("phone")}: 123-456-789
          <br />
          {t("emailAddress")}:{" "}
          <a href="mailto:kontakt@szkolajezykowa.pl">
            kontakt@szkolajezykowa.pl
          </a>
        </p>
      </section>
    </div>
  );
}

export default Contact;

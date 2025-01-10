import React from "react";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();
  return (
    <div className="home-container">
      <h1>{t("contactPage")}</h1>
      <section className="contact-section">
        <p>{t("contactDescription")}</p>
        <h2>{t("contact")}</h2>
        <p>
          {t("address")}: ul. Językowa 123, 00-001 Warszawa
          <br />
          {t("phone")}: 123-456-789
          <br />
          {t("emailAddress")}: kontakt@szkolajezykowa.pl
        </p>
      </section>
    </div>
  );
}

export default Contact;

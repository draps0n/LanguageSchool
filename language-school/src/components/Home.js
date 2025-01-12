import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import { toast } from "react-toastify";
import axios from "../api/axios";

function Home() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("/languages/taught");
        setLanguages(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(t("errorFetchingLanguages"));
        setGeneralError(t("errorFetchingLanguages"));
      }
    };

    fetchLanguages();
  }, [t]);

  if (loading) {
    return <Loading error={generalError} />;
  }

  return (
    <div className="home-container">
      <h1>{t("languageSchool")}</h1>
      <p>{t("welcomeMessage")}</p>
      <br />
      <section className="about-section">
        <h2>{t("about")}</h2>
        <p>{t("schoolDescription")}</p>
      </section>
      {generalError && <p>{generalError}</p>}
      <section className="courses-section">
        <h2>{t("toughtLanguages")}</h2>
        <ul>
          {languages.map((language) => (
            <li key={language.id}>{t(language.name)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;

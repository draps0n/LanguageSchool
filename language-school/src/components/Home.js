import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import { toast } from "react-toastify";
import axios from "../api/axios";

function Home() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("/languages");
        setLanguages(response.data);
        setLoading(false);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(t("errorFetchingLanguages"));
      }
    };

    fetchLanguages();
  }, [t]);

  if (loading) {
    return <Loading />;
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

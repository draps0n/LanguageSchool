import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function KnownLanguages({ teacherId, shouldShowButtons }) {
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const [knownLanguages, setKnownLanguages] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [chosenLanguage, setChosenLanguage] = useState({ id: 0 });
  const [languageError, setLanguageError] = useState("");
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const getTeacherLanguages = async () => {
      try {
        const response = await axios.get(`/teachers/${teacherId}/languages`);
        setKnownLanguages(response.data);
        setLoading(false);
      } catch (error) {
        toast.error(t("teacherLanguagesFetchError"));
        setGeneralError(t("teacherLanguagesFetchError"));
        console.error("Error fetching teacher languages:", error);
      }
    };

    getTeacherLanguages();
  }, [axios, teacherId, t]);

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const response = await axios.get("/languages");
        setLanguages(response.data);
        const filteredLanguages = response.data.filter(
          (language) =>
            !knownLanguages.some(
              (knownLanguage) => knownLanguage.id === language.id
            )
        );
        setAvailableLanguages(filteredLanguages);
      } catch (error) {
        toast.error(t("languagesFetchError"));
        setGeneralError(t("languagesFetchError"));
        console.error("Error fetching languages:", error);
      }
    };

    if (shouldShowButtons) {
      getLanguages();
    }
  }, [shouldShowButtons, knownLanguages, axios, t]);

  const handleDeleteLanguage = async (languageId) => {
    try {
      const response = await axios.delete(
        `/teachers/${teacherId}/languages/${languageId}`
      );

      if (response.status === 204) {
        setKnownLanguages((prevLanguages) =>
          prevLanguages.filter((language) => language.id !== languageId)
        );
      } else {
        throw new Error("Error deleting teacher language.");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error(t("cannotDeleteLanguageTeacherHasGroup"));
        setGeneralError(t("cannotDeleteLanguageTeacherHasGroup"));
      } else {
        console.error("Error deleting teacher language:", error);
        setGeneralError(t("deleteKnownLanguageError"));
        toast.error(t("deleteKnownLanguageError"));
      }
    }
  };

  const handleAddLanguage = async (e) => {
    e.preventDefault();

    if (!chosenLanguage || chosenLanguage.id === 0) {
      setLanguageError(t("chooseLanguageToAdd"));
      return;
    }

    try {
      const response = await axios.post(`/teachers/${teacherId}/languages`, {
        languageId: chosenLanguage.id,
      });

      if (response.status === 201) {
        setKnownLanguages((prevLanguages) => [
          ...prevLanguages,
          chosenLanguage,
        ]);
        setChosenLanguage({ id: 0 });
        setLanguageError("");
      } else {
        toast.error(t("addKnownLanguageError"));
        setGeneralError(t("addKnownLanguageError"));
        throw new Error("Error adding teacher language.");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        setGeneralError(t("teacherAlreadyKnowsLanguage"));
        toast.error(t("teacherAlreadyKnowsLanguage"));
      } else {
        console.error("Error adding teacher language:", error);
        setGeneralError(t("addKnownLanguageError"));
        toast.error(t("addKnownLanguageError"));
      }
    }
  };

  const handleLanguageChange = (e) => {
    const languageId = e.target.value;

    if (!languageId) {
      setLanguageError(t("chooseLanguageToAdd"));
      return;
    }

    const language = languages.find((language) => language.id === +languageId);
    if (!language) {
      setLanguageError(t("languageNotExists"));
      return;
    }

    setLanguageError("");
    setChosenLanguage(language);
  };

  if (loading) {
    return <Loading error={generalError} />;
  }

  return (
    <div className="known-languages-container">
      <div>
        <h3>
          {knownLanguages.length === 0
            ? t("noKnownLanguages")
            : t("knownLanguages") + ":"}
        </h3>
        <ul>
          {knownLanguages.map((language) => (
            <li key={language.id} className="known-language">
              <p className="known-language-item">{t(language.name)}</p>
              {shouldShowButtons && (
                <button
                  onClick={() => handleDeleteLanguage(language.id)}
                  className="icon-button remove-button known-language-item"
                >
                  <FaTimes />
                </button>
              )}
            </li>
          ))}
          {shouldShowButtons && (
            <li key={0}>
              <form>
                <div className="known-language-form">
                  <select
                    className="language-select"
                    name="language"
                    id="language"
                    required
                    value={chosenLanguage.id}
                    onChange={handleLanguageChange}
                  >
                    <option value={0} disabled hidden>
                      {t("choose")} {t("language")}...
                    </option>
                    {availableLanguages.map((language) => (
                      <option key={language.id} value={language.id}>
                        {t(language.name)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddLanguage}
                    className="icon-button add-button"
                  >
                    <FaPlus />
                  </button>
                </div>
              </form>
              {languageError && (
                <p className="language-error-message">{t(languageError)}</p>
              )}
              {generalError && (
                <p className="language-error-message">{t(generalError)}</p>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default KnownLanguages;

import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import "../styles/KnownLanguages.css";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

function KnownLanguages({ teacherId, shouldShowButtons }) {
  const axios = useAxiosAuth();
  const [knownLanguages, setKnownLanguages] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [chosenLanguage, setChosenLanguage] = useState({ id: 0 });
  const [languageError, setLanguageError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeacherLanguages = async () => {
      try {
        const response = await axios.get(`/teachers/${teacherId}/languages`);
        setKnownLanguages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teacher languages:", error);
      }
    };

    getTeacherLanguages();
  }, [axios, teacherId]);

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
        console.error("Error fetching languages:", error);
      }
    };

    if (shouldShowButtons) {
      getLanguages();
    }
  }, [shouldShowButtons, knownLanguages, axios]);

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
        toast.error(
          "Nie można usunąć języka, ponieważ nauczyciel prowadzi w nim grupę."
        );
      } else {
        console.error("Error deleting teacher language:", error);
        toast.error("Nie udało się usunąć języka.");
      }
    }
  };

  const handleAddLanguage = async (e) => {
    e.preventDefault();

    if (!chosenLanguage || chosenLanguage.id === 0) {
      setLanguageError("Musisz wybrać język, aby go dodać.");
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
        toast.error("Nie udało się dodać języka.");
        throw new Error("Error adding teacher language.");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error(
          "Nauczyciel już zna ten język. Nie można go dodać ponownie."
        );
      } else {
        console.error("Error adding teacher language:", error);
        toast.error("Nie udało się dodać języka.");
      }
    }
  };

  const handleLanguageChange = (e) => {
    const languageId = e.target.value;

    if (!languageId) {
      setLanguageError("Musisz wybrać język, aby go dodać.");
      return;
    }

    const language = languages.find((language) => language.id === +languageId);
    if (!language) {
      setLanguageError("Wybrany język nie istnieje.");
      return;
    }

    setLanguageError("");
    setChosenLanguage(language);
  };

  if (loading) {
    return <Loading />;
  }

  if (knownLanguages.length === 0) {
    return (
      <div className="known-languages-container">
        <h3>Nie przypisano znajomości języków.</h3>
        {shouldShowButtons && (
          <button
            onClick={handleAddLanguage}
            className="icon-button add-button"
          >
            <FaPlus />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="known-languages-container">
      <div>
        <h3>Znane języki:</h3>
        <ul>
          {knownLanguages.map((language) => (
            <li key={language.id} className="known-language">
              <p className="known-language-item">{language.name}</p>
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
                      Wybierz język
                    </option>
                    {availableLanguages.map((language) => (
                      <option key={language.id} value={language.id}>
                        {language.name}
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
                <p className="language-error-message">{languageError}</p>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default KnownLanguages;

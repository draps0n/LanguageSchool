import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import "../styles/KnownLanguages.css";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

function KnownLanguages({ teacherId, shouldShowButtons }) {
  const axios = useAxiosAuth();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeacherLanguages = async () => {
      try {
        const response = await axios.get(`/teachers/${teacherId}/languages`);
        setLanguages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teacher languages:", error);
      }
    };

    getTeacherLanguages();
  }, [axios, teacherId]);

  const handleDeleteLanguage = async (languageId) => {
    try {
      const response = await axios.delete(
        `/teachers/${teacherId}/languages/${languageId}`
      );

      if (response.status === 204) {
        setLanguages((prevLanguages) =>
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

  const handleAddLanguage = async () => {};

  if (loading) {
    return <Loading />;
  }

  if (languages.length === 0) {
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
          {languages.map((language) => (
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
        </ul>
      </div>
      {shouldShowButtons && (
        <button onClick={handleAddLanguage} className="icon-button add-button">
          <FaPlus />
        </button>
      )}
    </div>
  );
}

export default KnownLanguages;

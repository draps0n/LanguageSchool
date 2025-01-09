import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";

function KnownLanguages({ teacherId }) {
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

  if (loading) {
    return <Loading />;
  }

  if (languages.length === 0) {
    return <h4>Nie przypisano Ci znajomości języków</h4>;
  }

  return (
    <div>
      <h3>Znane języki:</h3>
      <ul>
        {languages.map((language) => (
          <li key={language.id}>{language.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default KnownLanguages;

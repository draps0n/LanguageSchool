// filepath: /c:/Users/krzys/OneDrive/Dokumenty/PJATK/5. semestr/TIN/TIN-projekt/language-school/src/components/CourseDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import "../styles/CourseDetails.css"; // Importowanie pliku CSS

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/groups/${id}`);
        console.log(response.data);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const { group, takenPlaces } = course;
  const takenPercentage = (takenPlaces / group.places) * 100;

  return (
    <div className="course-details">
      <h2>
        {group.language} - {group.level}
      </h2>
      <p>
        <strong>Opis:</strong> {group.description}
      </p>
      <p>
        <strong>Dzień:</strong> {group.day}
      </p>
      <p>
        <strong>Godzina:</strong> {group.startTime} - {group.endTime}
      </p>
      <p>
        <strong>Cena za zajęcia:</strong> {group.price} PLN
      </p>
      <p>
        <strong>Liczba miejsc:</strong> {takenPlaces}/{group.places}
      </p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${takenPercentage}%` }}
        ></div>
      </div>
      <p>
        <strong>Nauczyciel:</strong> {group.teacherName} {group.teacherLastName}
      </p>
    </div>
  );
};

export default CourseDetails;

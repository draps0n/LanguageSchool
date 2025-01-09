import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import CourseDetailsButtonPanel from "./CourseDetailsButtonPanel";
import "../styles/CourseDetails.css";

const CourseDetails = () => {
  const axios = useAxiosAuth();
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/groups/${id}`);
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

  const { group, takenPlaces, absences } = course;
  const takenPercentage = (takenPlaces / group.places) * 100;

  return (
    <div>
      <div className="course-details">
        <h2>
          {group.language.name} - {group.level.name}
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
          <strong>Nauczyciel:</strong> {group.teacher.name}{" "}
          {group.teacher.lastName}
        </p>
        {absences !== null && absences !== undefined && (
          <p>
            <strong>Liczba nieobecności:</strong> {absences}
          </p>
        )}
      </div>
      <CourseDetailsButtonPanel
        isMember={absences !== null && absences !== undefined}
      />
    </div>
  );
};

export default CourseDetails;

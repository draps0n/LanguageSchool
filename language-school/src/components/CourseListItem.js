import React from "react";
import { useNavigate } from "react-router-dom";

function CourseListItem({ index, group }) {
  const navigate = useNavigate();

  // Funkcja do obsługi kliknięcia na grupę
  const viewGroup = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <li key={index} onClick={() => viewGroup(group.id)} className="group-item">
      <img
        src={`/assets/images/${group.language}.svg`}
        alt="Group"
        className="group-image"
      />
      <div className="group-details">
        <h3>
          {group.language} - {group.level}
        </h3>
        <p>Dzień: {group.day}</p>
        <p>
          Godzina: {group.startTime} - {group.endTime}
        </p>
        <p>Cena: {group.price} PLN</p>
        <p>Liczba miejsc: {group.places}</p>
      </div>
    </li>
  );
}

export default CourseListItem;

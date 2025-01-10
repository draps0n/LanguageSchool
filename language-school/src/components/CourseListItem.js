import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CourseListItem({ index, group }) {
  const { t } = useTranslation();
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
          {t(group.language)} - {group.level}
        </h3>
        <p>
          {t("dayOfWeek")}: {t(group.day)}
        </p>
        <p>
          {t("time")}: {group.startTime} - {group.endTime}
        </p>
        <p>
          {t("priceForClasses")}: {group.price} PLN
        </p>
        <p>
          {t("numberOfPlaces")}: {group.places}
        </p>
      </div>
    </li>
  );
}

export default CourseListItem;

import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/CourseStudentsListItem.css";

function CourseStudentsListItem({ student }) {
  const { t } = useTranslation();
  return (
    <li className="course-students-list-item" key={student.email}>
      <div>
        <strong>{t("firstName")}:</strong> {student.name}
      </div>
      <div>
        <strong>{t("lastName")}:</strong> {student.lastName}
      </div>
      <div>
        <strong>{t("email")}:</strong> {student.email}
      </div>
      <div>
        <strong>{t("absences")}:</strong> {student.absences}
      </div>
    </li>
  );
}

export default CourseStudentsListItem;

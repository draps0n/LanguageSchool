import React from "react";
import "../styles/CourseStudentsListItem.css";

function CourseStudentsListItem({ student }) {
  return (
    <li className="course-students-list-item" key={student.email}>
      <div>
        <strong>Imię:</strong> {student.name}
      </div>
      <div>
        <strong>Nazwisko:</strong> {student.lastName}
      </div>
      <div>
        <strong>Email:</strong> {student.email}
      </div>
      <div>
        <strong>Nieobecności:</strong> {student.absences}
      </div>
    </li>
  );
}

export default CourseStudentsListItem;

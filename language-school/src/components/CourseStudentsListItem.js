import React from "react";
import { useTranslation } from "react-i18next";
import useAxiosAuth from "../hooks/useAxiosAuth";
import "../styles/CourseStudentsListItem.css";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

function CourseStudentsListItem({ student, groupId, refreshStudents }) {
  const { t } = useTranslation();
  const axios = useAxiosAuth();

  const handleDeleteFromCourse = async () => {
    try {
      const response = await axios.delete(
        `/groups/${groupId}/students/${student.id}`
      );
      if (response?.status === 204) {
        toast.success(t("studentDeletedFromCourse"));
        refreshStudents();
      } else {
        toast.error(t("errorDeletingStudentFromCourse"));
        throw new Error("Error deleting student from course");
      }
    } catch (error) {
      console.error("Error deleting student from course:", error);
      toast.error(t("errorDeletingStudentFromCourse"));
    }
  };

  return (
    <li className="course-students-list-item" key={student.id}>
      <div className="student-list-data">
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
      </div>
      <button
        className="remove-from-course-button"
        onClick={handleDeleteFromCourse}
      >
        <FaTimes />
      </button>
    </li>
  );
}

export default CourseStudentsListItem;

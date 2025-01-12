import React from "react";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";

function CourseStudentsListItem({
  student,
  groupId,
  refreshStudents,
  updateStudentAbsences,
}) {
  const { userData } = useAuth();
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

  const handleAddAbsence = async () => {
    try {
      const response = await axios.put(
        `/groups/${groupId}/students/${student.id}/absences`,
        {
          increment: 1,
        }
      );
      updateStudentAbsences(student.id, response.data.absences);
    } catch (error) {
      toast.error(t("errorUpdatingAbsences"));
    }
  };

  const handleRemoveAbsence = async () => {
    try {
      const response = await axios.put(
        `/groups/${groupId}/students/${student.id}/absences`,
        {
          increment: -1,
        }
      );
      updateStudentAbsences(student.id, response.data.absences);
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error(t("cannotHaveNegativeAbsences"));
      }
      toast.error(t("errorUpdatingAbsences"));
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
        <div className="student-absences">
          <strong>{t("absences")}:</strong> {student.absences}
          {userData.roleId === roles.TEACHER && (
            <>
              <button
                onClick={handleRemoveAbsence}
                className="remove-absence-button"
                disabled={student.absences === 0}
              >
                <FaMinus />
              </button>
              <button onClick={handleAddAbsence} className="add-absence-button">
                <FaPlus />
              </button>
            </>
          )}
        </div>
      </div>
      {userData.roleId === roles.EMPLOYEE && (
        <button
          className="remove-from-course-button"
          onClick={handleDeleteFromCourse}
        >
          <FaTimes />
        </button>
      )}
    </li>
  );
}

export default CourseStudentsListItem;

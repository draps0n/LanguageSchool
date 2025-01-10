import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import CourseStudentsListItem from "./CourseStudentsListItem";
import Pagination from "./Pagination";
import "../styles/CourseStudentsList.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function CourseStudentsList({ groupId }) {
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const studentsPerPage = 4;

  useEffect(() => {
    const fetchGroupStudents = async () => {
      try {
        const response = await axios.get(
          `/groups/${groupId}/students?page=${currentPage}&limit=${studentsPerPage}`
        );
        console.log(
          `/groups/${groupId}/students?page=${currentPage}&limit=${studentsPerPage}`,
          response.data
        );
        setStudents(response.data.students);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group students:", error);
        toast.error(t("errorFetchingCourseStudents"));
      }
    };

    fetchGroupStudents();
  }, [groupId, axios, currentPage, t]);

  if (loading) {
    return <Loading />;
  }

  if (students.length === 0) {
    return <h3>{t("noStudents")}</h3>;
  }

  return (
    <div className="course-students-list">
      <h3>{t("studentsList")}</h3>
      <ul>
        {students.map((student) => (
          <CourseStudentsListItem student={student} />
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default CourseStudentsList;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import Loading from "./Loading";
import CourseListItem from "./CourseListItem";
import "../styles/CoursesList.css";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const CoursesList = ({ isUserSpecific }) => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const axios = useAxiosAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [groups, setGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(-1);
  const groupsPerPage = 4;

  // Pobranie listy grup z serwera
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          isUserSpecific
            ? userData.roleId === roles.TEACHER
              ? `/groups/teacher?page=${currentPage}&limit=${groupsPerPage}`
              : `/groups/user?page=${currentPage}&limit=${groupsPerPage}`
            : `/groups?page=${currentPage}&limit=${groupsPerPage}`
        );
        setGroups(response.data.groups);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching groups:", error);
        toast.error(t("errorFetchingCourses"));
      }
    };

    fetchGroups();
  }, [currentPage, axios, isUserSpecific, userData.roleId, t]);

  const addGroup = () => {
    navigate("/courses/add");
  };

  if (totalPages === -1) {
    return <Loading />;
  }

  if (!groups.length) {
    return (
      <div>
        <h1 className="text-center">{t("noCourses")}</h1>
        {userData.roleId === roles.EMPLOYEE && (
          <button className="group-add-button" onClick={addGroup}>
            {t("add")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="group-list-container">
      <h1 className="text-center">
        {isUserSpecific ? t("myCourses") : t("coursesList")}
      </h1>
      {userData.roleId === roles.EMPLOYEE && (
        <button className="group-add-button" onClick={addGroup}>
          {t("add")}
        </button>
      )}

      <ul className="group-list">
        {groups.map((group, index) => (
          <CourseListItem key={index} group={group} />
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CoursesList;

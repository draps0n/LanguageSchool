import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import Loading from "./Loading";
import CourseListItem from "./CourseListItem";
import "../styles/CoursesList.css";

const CoursesList = ({ isUserSpecific }) => {
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
            ? `/groups/user?page=${currentPage}&limit=${groupsPerPage}`
            : `/groups?page=${currentPage}&limit=${groupsPerPage}`
        );
        setGroups(response.data.groups);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [currentPage, axios, isUserSpecific]);

  // Funkcja do obsługi przycisku "Następna"
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Funkcja do obsługi przycisku "Poprzednia"
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const addGroup = () => {
    navigate("/courses/add");
  };

  if (totalPages === -1) {
    return <Loading />;
  }

  if (!groups.length) {
    return (
      <div>
        <h1 className="text-center">Brak grup do wyświetlenia.</h1>
        {userData.roleId === roles.EMPLOYEE && (
          <button className="group-add-button" onClick={addGroup}>
            Dodaj
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="group-list-container">
      <h1 className="text-center">{isUserSpecific ? "Moje kursy" : "Kursy"}</h1>
      {userData.roleId === roles.EMPLOYEE && (
        <button className="group-add-button" onClick={addGroup}>
          Dodaj
        </button>
      )}

      <ul className="group-list">
        {groups.map((group, index) => (
          <CourseListItem key={index} group={group} />
        ))}
      </ul>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Poprzednia
        </button>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Następna
        </button>
      </div>
    </div>
  );
};

export default CoursesList;

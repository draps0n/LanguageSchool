import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import "../styles/CoursesList.css";

const CoursesList = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const axios = useAxiosAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [groups, setGroups] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const groupsPerPage = 4;

  // Pobranie listy grup z serwera
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `/groups?page=${currentPage}&limit=${groupsPerPage}`
        );
        setGroups(response.data.groups);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [currentPage, axios]);

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

  // Funkcja do obsługi kliknięcia na grupę
  const viewGroup = (id) => {
    navigate(`/courses/${id}`);
  };

  const addGroup = () => {
    navigate("/courses/add");
  };

  return (
    <div className="group-list-container">
      <h1 className="text-center">Lista grup</h1>
      {userData.roleId === roles.EMPLOYEE && (
        <button className="group-add-button" onClick={addGroup}>
          Dodaj
        </button>
      )}

      <ul className="group-list">
        {groups.map((group, index) => (
          <li
            key={index}
            onClick={() => viewGroup(group.id)}
            className="group-item"
          >
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

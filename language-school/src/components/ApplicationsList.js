import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import ApplicationListItem from "./ApplicationListItem";

function ApplicationsList({ isUserSpecific }) {
  const navigate = useNavigate();
  const axios = useAxiosAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [applications, setApplications] = useState([]);
  const applicationsPerPage = 4;

  useEffect(() => {
    const getApplicationsForUser = async () => {
      try {
        const response = await axios.get(
          `/applications/user?page=${currentPage}&limit=${applicationsPerPage}`
        );
        console.log("Applications:", response.data);
        setApplications(response.data.applications);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    const getAllApplications = async () => {
      try {
        const response = await axios.get(
          `/applications?page=${currentPage}&limit=${applicationsPerPage}`
        );
        console.log("Applications:", response.data);
        setApplications(response.data.applications);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (isUserSpecific) {
      getApplicationsForUser();
    } else {
      getAllApplications();
    }
  }, [axios, currentPage, isUserSpecific]);

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

  if (totalPages === -1) {
    return <Loading />;
  }

  if (applications.length === 0) {
    return <div>Brak zgłoszeń</div>;
  }

  return (
    <div>
      <h1>Lista zgłoszeń</h1>
      <div>
        {applications.map((application) => (
          <div key={application.id}>
            <ApplicationListItem application={application} />
          </div>
        ))}
      </div>
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
}

export default ApplicationsList;

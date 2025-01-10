import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import ApplicationListItem from "./ApplicationListItem";
import Pagination from "./Pagination";
import { toast } from "react-toastify";

function ApplicationsList({ isUserSpecific }) {
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

  const refreshApplications = async () => {
    try {
      const response = await axios.get(
        isUserSpecific
          ? `/applications/user?page=${currentPage}&limit=${applicationsPerPage}`
          : `/applications?page=${currentPage}&limit=${applicationsPerPage}`
      );
      setApplications(response.data.applications);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Wystąpił błąd podczas odświeżania zgłoszeń.");
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
            <ApplicationListItem
              application={application}
              refreshApplications={refreshApplications}
            />
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default ApplicationsList;

import React, { useEffect, useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import ApplicationListItem from "./ApplicationListItem";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function ApplicationsList({
  isUserSpecific,
  groupId,
  applicationsPerPage = 4,
}) {
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const [applications, setApplications] = useState([]);
  const [generalError, setGeneralError] = useState("");

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
        toast.error(t("errorFetchingApplications"));
        setGeneralError(t("errorFetchingApplications"));
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
        toast.error(t("errorFetchingApplications"));
        setGeneralError(t("errorFetchingApplications"));
      }
    };

    const getApplicationsForGroup = async () => {
      try {
        const response = await axios.get(
          `/applications/group/${groupId}?page=${currentPage}&limit=${applicationsPerPage}`
        );
        setApplications(response.data.applications);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error(t("errorFetchingApplications"));
        setGeneralError(t("errorFetchingApplications"));
      }
    };

    const getApplicationsForUserToGroup = async () => {
      try {
        const response = await axios.get(
          `/applications/group/${groupId}/user?page=${currentPage}&limit=${applicationsPerPage}`
        );
        setApplications(response.data.applications);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error(t("errorFetchingApplications"));
        setGeneralError(t("errorFetchingApplications"));
      }
    };

    if (isUserSpecific) {
      if (groupId) {
        getApplicationsForUserToGroup();
      } else {
        getApplicationsForUser();
      }
    } else if (groupId) {
      getApplicationsForGroup();
    } else {
      getAllApplications();
    }
  }, [axios, currentPage, isUserSpecific, t, applicationsPerPage, groupId]);

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
      toast.error(t("applicationsRefreshError"));
      setGeneralError(t("applicationsRefreshError"));
    }
  };

  if (totalPages === -1) {
    return <Loading error={generalError} />;
  }

  if (applications.length === 0) {
    return <div>{t("noApplications")}</div>;
  }

  return (
    <div>
      <h1>{t("applicationsList")}</h1>
      {generalError && <p className="error">{generalError}</p>}
      <div>
        {applications.map((application) => (
          <div key={application.id}>
            <ApplicationListItem
              application={application}
              refreshApplications={refreshApplications}
              shouldShowGroup={groupId === undefined || groupId === null}
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

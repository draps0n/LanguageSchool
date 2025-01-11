import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import roles from "../constants/roles";
import { formatDate } from "../util/helpers";
import UserDetailsButtons from "./UserDetailsButtons";
import KnownLanguages from "./KnownLanguages";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function UserDetails() {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const axios = useAxiosAuth();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        toast.error(t("errorWhileFetchingData"));
        console.error(error);
      }
    };

    fetchUser();
  }, [axios, userId, t]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`user-details-page ${
        user.roleId === roles.EMPLOYEE
          ? "employee-card"
          : user.roleId === roles.TEACHER
          ? "teacher-card"
          : user.roleId === roles.STUDENT
          ? "student-card"
          : ""
      }`}
    >
      <h1>{t("userDetails")}</h1>
      <div className="user-details-container">
        <img
          src={`/assets/images/user.svg`}
          alt="user-picture"
          className="user-photo"
        />
        <div className="user-details">
          <p className="info-item">
            <span className="label">{t("firstName")}:</span> {user.name}
          </p>
          <p className="info-item">
            <span className="label">{t("lastName")}:</span> {user.lastName}
          </p>
          <p className="info-item">
            <span className="label">{t("email")}:</span> {user.email}
          </p>
          <p className="info-item">
            <span className="label">{t("role")}:</span> {t(user.role)}
          </p>
          <p className="info-item">
            <span className="label">{t("dateOfBirth")}:</span>{" "}
            {formatDate(user.dateOfBirth)}
          </p>
          {user.roleId === roles.STUDENT && (
            <>
              <p className="info-item">
                <span className="label">{t("description")}:</span>{" "}
                {user.description}
              </p>
              <p className="info-item">
                <span className="label">{t("discount")}:</span>{" "}
                {user.discount ? t("yes") : t("no")}
              </p>
            </>
          )}
          {user.roleId === roles.EMPLOYEE && (
            <p className="info-item">
              <span className="label">{t("salary")}:</span> {user.salary} PLN
            </p>
          )}
          {user.roleId === roles.TEACHER && (
            <>
              <p className="info-item">
                <span className="label">{t("hourlyRate")}:</span>{" "}
                {user.hourlyRate} PLN/h
              </p>
              <p className="info-item">
                <span className="label">{t("hoursWorked")}:</span>{" "}
                {user.hoursWorked} h
              </p>
              <KnownLanguages teacherId={user.id} shouldShowButtons={true} />
            </>
          )}
        </div>
      </div>
      <UserDetailsButtons userId={user.id} />
    </div>
  );
}

export default UserDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import Loading from "./Loading";
import roles from "../constants/roles";
import { formatDate } from "../util/helpers";
import UserDetailsButtons from "./UserDetailsButtons";
import KnownLanguages from "./KnownLanguages";
import "../styles/UserDetails.css";

function UserDetails() {
  const [user, setUser] = useState(null);
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
        console.error(error);
      }
    };

    fetchUser();
  }, [axios, userId]);

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
      <h1>Szczegóły użytkownika</h1>
      <div className="user-details-container">
        <img
          src={`/assets/images/user.svg`}
          alt="user-picture"
          className="user-photo"
        />
        <div className="user-details">
          <p className="info-item">
            <span className="label">Imię:</span> {user.name}
          </p>
          <p className="info-item">
            <span className="label">Nazwisko:</span> {user.lastName}
          </p>
          <p className="info-item">
            <span className="label">Email:</span> {user.email}
          </p>
          <p className="info-item">
            <span className="label">Rola:</span> {user.role}
          </p>
          <p className="info-item">
            <span className="label">Data urodzenia:</span>{" "}
            {formatDate(user.dateOfBirth)}
          </p>
          {user.roleId === roles.STUDENT && (
            <>
              <p className="info-item">
                <span className="label">Opis:</span> {user.description}
              </p>
              <p className="info-item">
                <span className="label">Czy przysługuje zniżka?:</span>{" "}
                {user.discount ? "Tak" : "Nie"}
              </p>
            </>
          )}
          {user.roleId === roles.EMPLOYEE && (
            <p className="info-item">
              <span className="label">Pensja:</span> {user.salary} PLN
            </p>
          )}
          {user.roleId === roles.TEACHER && (
            <>
              <p className="info-item">
                <span className="label">Stawka godzinowa:</span>{" "}
                {user.hourlyRate} PLN
              </p>
              <p className="info-item">
                <span className="label">Przepracowane godziny:</span>{" "}
                {user.hoursWorked}
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

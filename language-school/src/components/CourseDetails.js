import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosAuth from "../hooks/useAxiosAuth";
import CourseDetailsButtonPanel from "./CourseDetailsButtonPanel";
import CourseStudentsList from "./CourseStudentsList";
import "../styles/CourseDetails.css";
import roles from "../constants/roles";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import CourseDetailsAdminInfo from "./CourseDetailsAdminInfo";
import ApplicationsList from "./ApplicationsList";

const CourseDetails = () => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const axios = useAxiosAuth();
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [takenPlaces, setTakenPlaces] = useState(0);
  const [absences, setAbsences] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/groups/${id}`);
        setGroup(response.data.group);
        setTakenPlaces(response.data.takenPlaces);
        setAbsences(response.data.absences);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error(t("errorFetchingCourse"));
      }
    };

    fetchCourse();
  }, [id, axios, t]);

  if (!group) {
    return <Loading />;
  }

  return (
    <div>
      <div className="course-details">
        <h2>
          {t(group.language.name)} - {group.level.name}
        </h2>
        <p>
          <strong>{t("groupCode")}:</strong> {group.language.code}-{group.id}
        </p>
        <p>
          <strong>{t("description")}:</strong> {group.description}
        </p>
        <p>
          <strong>{t("dayOfWeek")}:</strong> {t(group.day)}
        </p>
        <p>
          <strong>{t("time")}:</strong> {group.startTime} - {group.endTime}
        </p>
        <p>
          <strong>{t("priceForClasses")}:</strong> {group.price} PLN
        </p>
        <p>
          <strong>{t("takenPlaces")}:</strong> {takenPlaces}/{group.places}
        </p>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(takenPlaces / group.places) * 100}%` }}
          ></div>
        </div>
        <p>
          <strong>{t("teacher")}:</strong> {group.teacher.name}{" "}
          {group.teacher.lastName}
        </p>
        {/* Liczba nieobecności ucznia i jego zgłoszeń do grupy  */}
        {absences !== null && absences !== undefined && (
          <div>
            <p>
              <strong>{t("absencesNumber")}:</strong> {absences}
            </p>
            <ApplicationsList
              isUserSpecific={true}
              groupId={group.id}
              applicationsPerPage={2}
            />
          </div>
        )}
        {/* Lista uczniów dla nauczyciela grupy */}
        {group.teacher.id === userData.userId && (
          <CourseStudentsList
            groupId={group.id}
            takenPlaces={takenPlaces}
            setTakenPlaces={setTakenPlaces}
          />
        )}
        {/* Panel kontrolny dla pracownika */}
        {userData.roleId === roles.EMPLOYEE && (
          <CourseDetailsAdminInfo
            groupId={group.id}
            takenPlaces={takenPlaces}
            setTakenPlaces={setTakenPlaces}
          />
        )}
      </div>
      <CourseDetailsButtonPanel
        isMember={absences !== null && absences !== undefined}
        groupId={group.id}
      />
    </div>
  );
};

export default CourseDetails;

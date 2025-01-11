import React, { useState } from "react";
import CourseStudentsList from "./CourseStudentsList";
import { useTranslation } from "react-i18next";
import ApplicationsList from "./ApplicationsList";
import "../styles/CourseDetailsAdminInfo.css";

const STUDENTS = "students";
const APPLICATIONS = "applications";

function CourseDetailsAdminInfo({ groupId, takenPlaces, setTakenPlaces }) {
  const [whatIsShown, setWhatIsShown] = useState(STUDENTS);
  const { t } = useTranslation();

  const handleButtonClick = () => {
    setWhatIsShown((prev) => (prev === STUDENTS ? APPLICATIONS : STUDENTS));
  };

  return (
    <div className="course-details-admin-info">
      <button onClick={handleButtonClick} className="small-button">
        {whatIsShown === STUDENTS ? t("showApplications") : t("showStudents")}
      </button>
      {whatIsShown === STUDENTS ? (
        <CourseStudentsList
          groupId={groupId}
          takenPlaces={takenPlaces}
          setTakenPlaces={setTakenPlaces}
        />
      ) : (
        <ApplicationsList
          isUserSpecific={false}
          groupId={groupId}
          applicationsPerPage={2}
        />
      )}
    </div>
  );
}

export default CourseDetailsAdminInfo;

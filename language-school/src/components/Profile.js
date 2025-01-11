import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import roles from "../constants/roles";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { toast } from "react-toastify";
import { formatDate } from "../util/helpers";
import {
  validateName,
  validateLastName,
  validateEmail,
  validateDateOfBirth,
  validatePassword,
  validateIfPasswordsMatch,
  validateDescription,
  validateEmployeeSalary,
} from "../util/validators";
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";
import Loading from "./Loading";
import KnownLanguages from "./KnownLanguages";
import { useTranslation } from "react-i18next";

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const { userData } = useAuth();
  const axios = useAxiosAuth();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    newPassword: "",
    passwordConfirmation: "",
    description: "",
    hoursWorked: "",
    hourlyRate: "",
    discount: false,
    salary: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    newPassword: "",
    passwordConfirmation: "",
    description: "",
    salary: "",
  });

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get(`/users/profile`);
        const {
          name,
          lastName,
          email,
          dateOfBirth,
          description,
          salary,
          hoursWorked,
          hourlyRate,
          discount,
        } = response.data;
        setFormData({
          name,
          lastName,
          email,
          dateOfBirth: formatDate(dateOfBirth),
          password: "",
          newPassword: "",
          passwordConfirmation: "",
          description,
          hoursWorked,
          hourlyRate,
          discount,
          salary,
        });

        setUser({
          name,
          lastName,
          email,
          dateOfBirth: formatDate(dateOfBirth),
          description,
          salary,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(t("errorFetchingUserData"));
      }
    };

    getProfileData();
  }, [userData, axios, t]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setFormData((prev) => ({
      ...prev,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      description: user.description,
      salary: user.salary,
    }));
  };

  const viewMyCourses = () => {
    navigate("/my-courses");
  };

  const viewMyApplications = () => {
    navigate("/my-applications");
  };

  const viewDeleteAccountConfirmation = async () => {
    navigate("/profile/delete");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    switch (name) {
      case "name":
        setErrors((prev) => ({
          ...prev,
          [name]: validateName(value),
        }));
        break;
      case "lastName":
        setErrors((prev) => ({
          ...prev,
          [name]: validateLastName(value),
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          [name]: validateEmail(value),
        }));
        break;
      case "newPassword":
        setErrors((prev) => ({
          ...prev,
          newPassword: validatePassword(value, false),
        }));
        break;
      case "passwordConfirmation":
        setErrors((prev) => ({
          ...prev,
          passwordConfirmation: validateIfPasswordsMatch(
            formData.newPassword,
            value
          ),
        }));
        break;
      case "dateOfBirth":
        setErrors((prev) => ({
          ...prev,
          [name]: validateDateOfBirth(value),
        }));
        break;
      case "description":
        setErrors((prev) => ({
          ...prev,
          [name]: validateDescription(value),
        }));
        break;
      case "salary":
        setErrors((prev) => ({
          ...prev,
          [name]: validateEmployeeSalary(value),
        }));
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      validateName(formData.name) ||
      validateLastName(formData.lastName) ||
      validateEmail(formData.email) ||
      validateDateOfBirth(formData.dateOfBirth) ||
      validatePassword(formData.newPassword) ||
      (formData.newPassword &&
        validateIfPasswordsMatch(
          formData.newPassword,
          formData.passwordConfirmation
        )) ||
      (userData.roleId === roles.STUDENT &&
        validateDescription(formData.description)) ||
      (userData.roleId === roles.EMPLOYEE &&
        validateEmployeeSalary(formData.salary))
    ) {
      toast.error(t("formContainsErrors"));
      return;
    }

    const {
      name,
      lastName,
      email,
      dateOfBirth,
      password,
      newPassword,
      description,
      salary,
    } = formData;

    try {
      await axios.put("/users/profile", {
        name,
        lastName,
        email,
        dateOfBirth,
        password,
        newPassword,
        description,
        salary,
      });

      setUser({
        name,
        lastName,
        email,
        dateOfBirth,
        description,
        salary,
      });

      setFormData((prev) => ({
        ...prev,
        password: "",
        newPassword: "",
        passwordConfirmation: "",
      }));

      toast.success(t("profileUpdated"));
      setEditMode(false);
    } catch (error) {
      if (error.response.status === 409) {
        toast.error(t("emailTaken"));
      } else if (
        error.response.status === 401 &&
        error?.response?.data?.message
      ) {
        toast.error(t("incorrectPassword"));
      } else {
        toast.error(t("updateProfileError"));
      }

      // Resetuj dane w formularzy, gdy błąd
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        password: "",
        newPassword: "",
        passwordConfirmation: "",
        description: user.description,
        salary: user.salary,
      }));

      toast.error(t("profileEditError"));
      console.error("Error updating user data:", error);
      setEditMode(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div
      className={`profile-page ${
        userData.roleId === roles.EMPLOYEE
          ? "employee-card"
          : userData.roleId === roles.TEACHER
          ? "teacher-card"
          : "student-card"
      }`}
    >
      <form onSubmit={handleFormSubmit}>
        <div className="profile-container">
          <div className="profile-left">
            <h1>{t("yourProfile")}</h1>
            <p>{t("welcomeProfile")}</p>
            <p className="profile-role-name">
              <strong>
                {userData.roleId === roles.EMPLOYEE
                  ? t("employeeRole")
                  : userData.roleId === roles.TEACHER
                  ? t("teacherRole")
                  : t("studentRole")}
              </strong>
            </p>

            <InputField
              label={t("firstName")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required={true}
              autoComplete="given-name"
              readOnly={!editMode}
            />

            <InputField
              label={t("lastName")}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required={true}
              autoComplete="family-name"
              readOnly={!editMode}
            />

            <InputField
              label={t("email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required={true}
              autoComplete="email"
              readOnly={!editMode}
            />

            <InputField
              label={t("dateOfBirth")}
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required={true}
              autoComplete="bday"
              readOnly={!editMode}
            />

            <InputField
              label={t("password")}
              type="password"
              name="password"
              value={editMode ? formData.password : "********"}
              onChange={handleChange}
              readOnly={!editMode}
              autoComplete="current-password"
            />

            {editMode && (
              <>
                <InputField
                  label={t("newPassword")}
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  autoComplete="new-password"
                />

                <InputField
                  label={t("newPasswordConfirmation")}
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  error={errors.passwordConfirmation}
                  autoComplete="new-password"
                />
              </>
            )}
          </div>
          <div className="profile-right">
            <img
              src={`/assets/images/user.svg`}
              alt="user-picture"
              className="user-photo"
            />
            {userData.roleId === roles.STUDENT && (
              <div className="student-info">
                <InputTextArea
                  label={t("description")}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  placeholder={"Wpisz opis"}
                  rows="7"
                  readOnly={!editMode}
                />

                <InputField
                  label={t("discount")}
                  type="checkbox"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  disabled={true}
                />
              </div>
            )}
            {userData.roleId === roles.TEACHER && (
              <div className="teacher-info">
                <InputField
                  label={t("hourlyRate") + " (PLN/h)"}
                  name="hourlyRate"
                  type="number"
                  value={formData.hourlyRate || ""}
                  readOnly
                />

                <InputField
                  label={t("hoursWorked") + " (h)"}
                  name="hoursWorked"
                  type="number"
                  value={formData.hoursWorked || ""}
                  readOnly
                />

                <KnownLanguages teacherId={userData.userId} />
              </div>
            )}
            {userData.roleId === roles.EMPLOYEE && (
              <div className="employee-info">
                <InputField
                  label={t("salary") + " (PLN)"}
                  name="salary"
                  type="number"
                  onChange={handleChange}
                  value={formData.salary || ""}
                  readOnly={!editMode}
                />
              </div>
            )}
          </div>
        </div>
        <div className="profile-buttons">
          <button onClick={toggleEditMode} type="button">
            {editMode ? t("cancel") : t("edit")}
          </button>
          {editMode && <button type="submit">{t("save")}</button>}
          {editMode && (
            <button onClick={viewDeleteAccountConfirmation} type="button">
              {t("deleteAccount")}
            </button>
          )}
          {!editMode &&
            (userData.roleId === roles.STUDENT ||
              userData.roleId === roles.TEACHER) && (
              <button onClick={viewMyCourses} type="button">
                {t("myCourses")}
              </button>
            )}
          {!editMode && userData.roleId === roles.STUDENT && (
            <button onClick={viewMyApplications} type="button">
              {t("myApplications")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;

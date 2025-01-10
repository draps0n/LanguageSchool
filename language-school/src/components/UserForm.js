import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";
import { useParams } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import FormSelect from "./FormSelect";
import roles from "../constants/roles";
import { useNavigate } from "react-router-dom";
import {
  validateName,
  validateLastName,
  validateEmail,
  validateDateOfBirth,
  validateEmployeeSalary,
  validateTeacherHoursWorked,
  validateTeacherHourlyRate,
  validatePassword,
  validateIfPasswordsMatch,
  validateStudentDiscount,
} from "../util/validators";
import { formatDate } from "../util/helpers";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import { toast } from "react-toastify";
import BackButton from "./BackButton";
import { FaSave } from "react-icons/fa";

function UserForm({ isRegistration }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const axios = useAxiosAuth();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    passwordConfirmation: "",
    description: "",
    discount: "",
    hoursWorked: "",
    hourlyRate: "",
    salary: "",
  });

  const [rolesFromDb, setRolesFromDb] = useState(null);
  const [chosenRole, setChosenRole] = useState(null);

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    passwordConfirmation: "",
    discount: "",
    hoursWorked: "",
    hourlyRate: "",
    salary: "",
    role: "",
  });

  useEffect(() => {
    // Pobierz dane użytkownika
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          lastName: response.data.lastName,
          email: response.data.email,
          dateOfBirth: formatDate(response.data.dateOfBirth),
          description: response.data.description,
          discount: response.data.discount ? true : false,
          hoursWorked: response.data.hoursWorked,
          hourlyRate: response.data.hourlyRate,
          salary: response.data.salary,
        });
      } catch (error) {
        console.error(error);
        toast.error(t("errorFetchingUserData"));
      }
    };

    if (!isRegistration) {
      fetchUser();
    }
  }, [axios, userId, isRegistration, t]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/roles");
        setRolesFromDb(
          response.data.filter((role) => role.id !== roles.STUDENT)
        );
      } catch (error) {
        console.error(error);
        toast.error(t("errorFetchingRoles"));
      }
    };
    fetchRoles();
  }, [axios, t]);

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.name]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    switch (e.target.name) {
      case "name":
        setErrors({
          ...errors,
          name: validateName(e.target.value),
        });
        break;
      case "lastName":
        setErrors({
          ...errors,
          lastName: validateLastName(e.target.value),
        });
        break;
      case "email":
        setErrors({
          ...errors,
          email: validateEmail(e.target.value),
        });
        break;
      case "dateOfBirth":
        setErrors({
          ...errors,
          dateOfBirth: validateDateOfBirth(e.target.value),
        });
        break;
      case "password":
        setErrors({
          ...errors,
          password: validatePassword(e.target.value, true),
        });
        break;
      case "passwordConfirmation":
        setErrors({
          ...errors,
          passwordConfirmation: validateIfPasswordsMatch(
            formData.password,
            e.target.value
          ),
        });
        break;
      case "discount":
        setErrors({
          ...errors,
          discount: validateStudentDiscount(e.target.value),
        });
        break;
      case "hoursWorked":
        setErrors({
          ...errors,
          hoursWorked: validateTeacherHoursWorked(e.target.value),
        });
        break;
      case "hourlyRate":
        setErrors({
          ...errors,
          hourlyRate: validateTeacherHourlyRate(e.target.value),
        });

        break;
      case "salary":
        setErrors({
          ...errors,
          salary: validateEmployeeSalary(e.target.value),
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isRegistration) {
      let toSend = {};

      if (user.roleId === roles.STUDENT) {
        const validationResult = validateStudentDiscount(formData.discount);
        if (validationResult) {
          toast.error(t(validationResult));
          return;
        }

        toSend = {
          discount: formData.discount,
        };
      } else if (user.roleId === roles.EMPLOYEE) {
        const validationResult = validateEmployeeSalary(formData.salary);
        if (validationResult) {
          toast.error(t(validationResult));
          return;
        }

        toSend = {
          salary: formData.salary,
        };
      } else if (user.roleId === roles.TEACHER) {
        const validationResultHoursWokred = validateTeacherHoursWorked(
          formData.hoursWorked
        );
        if (validationResultHoursWokred) {
          toast.error(t(validationResultHoursWokred));
          return;
        }

        const validationResultHoursWorked = validateTeacherHourlyRate(
          formData.hourlyRate
        );
        if (validationResultHoursWorked) {
          toast.error(t(validationResultHoursWorked));
          return;
        }

        toSend = {
          hoursWorked: formData.hoursWorked,
          hourlyRate: formData.hourlyRate,
        };
      } else {
        toast.error(t("unknownRole"));
        return;
      }

      try {
        await axios.put(`/users/${userId}`, toSend);
        toast.success(t("userDataEditSuccess"));
        navigate(`/admin/users/${userId}`);
      } catch (error) {
        console.error(error);
        toast.error(t("userDataEditError"));
      }
    } else {
      let toSend = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
        roleId: chosenRole,
      };

      if (
        validateName(formData.name) ||
        validateLastName(formData.lastName) ||
        validateEmail(formData.email) ||
        validateDateOfBirth(formData.dateOfBirth) ||
        validatePassword(formData.password, true) ||
        validateIfPasswordsMatch(
          formData.password,
          formData.passwordConfirmation
        )
      ) {
        toast.error(t("formContainsErrors"));
        return;
      }

      if (chosenRole === roles.EMPLOYEE) {
        const validationResult = validateEmployeeSalary(formData.salary);
        if (validationResult) {
          toast.error(t(validationResult));
          return;
        }

        toSend = {
          ...toSend,
          salary: formData.salary,
        };
      } else if (chosenRole === roles.TEACHER) {
        const validationResultHoursWokred = validateTeacherHoursWorked(
          formData.hoursWorked
        );
        if (validationResultHoursWokred) {
          toast.error(t(validationResultHoursWokred));
          return;
        }

        const validationResultHourlyRate = validateTeacherHourlyRate(
          formData.hourlyRate
        );
        if (validationResultHourlyRate) {
          toast.error(t(validationResultHourlyRate));
          return;
        }

        toSend = {
          ...toSend,
          hoursWorked: formData.hoursWorked,
          hourlyRate: formData.hourlyRate,
        };
      } else {
        toast.error(t("roleNotChosen"));
        setErrors({
          ...errors,
          role: "Musisz wybrać rolę nowego użytkownika",
        });
        return;
      }

      try {
        const response = await axios.post("/users", toSend);
        toast.success(t("userRegisterSuccess"));
        navigate(`/admin/users/${response.data.userId}`);
      } catch (error) {
        console.error(error);
        toast.error(t("userRegisterError"));
      }
    }
  };

  if ((!isRegistration && !user) || (isRegistration && !rolesFromDb)) {
    return <Loading />;
  }

  return (
    <div>
      <h1>
        {isRegistration ? "Rejestracja użytkownika" : "Edycja użytkownika"}
      </h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label={t("firstName")}
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          readOnly={!isRegistration}
        />

        <InputField
          label={t("lastName")}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          readOnly={!isRegistration}
        />

        <InputField
          label={t("email")}
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          readOnly={!isRegistration}
        />

        <InputField
          label={t("dateOfBirth")}
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
          readOnly={!isRegistration}
          type="date"
        />

        {isRegistration && (
          <InputField
            label={t("password")}
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            error={errors.password}
          />
        )}

        {isRegistration && (
          <InputField
            label={t("passwordConfirmation")}
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            type="password"
            error={errors.passwordConfirmation}
          />
        )}

        {!isRegistration && (
          <InputField
            label={t("role")}
            name="role"
            value={t(user.role)}
            readOnly={true}
          />
        )}

        {isRegistration && (
          <FormSelect
            label={t("role")}
            name="role"
            value={chosenRole}
            onChange={(e) => {
              setChosenRole(parseInt(e.target.value));
              setErrors({ ...errors, role: "" });
            }}
            options={rolesFromDb}
            error={errors.role}
            shouldTranslateName={true}
          />
        )}

        {((user && user.roleId === roles.STUDENT) ||
          (isRegistration && chosenRole === roles.STUDENT)) && (
          <>
            <InputTextArea
              label={t("description")}
              name="description"
              value={formData.description}
              readOnly={true}
            />

            <InputField
              label={t("discount")}
              name="discount"
              type="checkbox"
              onChange={handleChange}
              error={errors.discount}
              checked={formData.discount}
            />
          </>
        )}

        {((user && user.roleId === roles.EMPLOYEE) ||
          (isRegistration && chosenRole === roles.EMPLOYEE)) && (
          <InputField
            label={t("salary")}
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            error={errors.salary}
          />
        )}

        {((user && user.roleId === roles.TEACHER) ||
          (isRegistration && chosenRole === roles.TEACHER)) && (
          <>
            <InputField
              label={t("hoursWorked")}
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleChange}
              error={errors.hoursWorked}
            />

            <InputField
              label={t("hourlyRate")}
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              error={errors.hourlyRate}
            />
          </>
        )}
        <button className="small-button" type="submit">
          <FaSave className="icon" />
          {isRegistration ? t("registerUser") : t("saveEdit")}
        </button>
        <BackButton />
      </form>
    </div>
  );
}

export default UserForm;

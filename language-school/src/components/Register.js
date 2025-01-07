import React, { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  validateName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateIfPasswordsMatch,
  validateDateOfBirth,
  validateDescription,
} from "../util/validators";
import InputField from "./InputField";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";
import InputTextArea from "./InputTextArea";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      validateEmail(formData.email) ||
      validatePassword(formData.password) ||
      validateIfPasswordsMatch(formData.password, formData.confirmPassword) ||
      validateName(formData.name) ||
      validateLastName(formData.lastName) ||
      validateDateOfBirth(formData.dateOfBirth) ||
      validateDescription(formData.description)
    ) {
      toast.error("Formularz zawiera błędy");
      return;
    }

    try {
      const response = await axios.post(
        "/auth/register",
        JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          password: formData.password,
          description: formData.description,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setErrors({
          email: "",
          name: "",
          lastName: "",
          dateOfBirth: "",
          description: "",
          password: "",
          confirmPassword: "",
        });
        toast.success("Rejestracja zakończona pomyślnie!");
        navigate("/login");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: "Użytkownik o podanym adresie email już istnieje",
        }));
        toast.error("Użytkownik o podanym adresie email już istnieje");
      } else {
        toast.error("Błąd podczas rejestracji. Spróbuj ponownie później.");
      }
    }
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
      case "password":
      case "confirmPassword":
        const newPassword = name === "password" ? value : formData.password;
        const newConfirmPassword =
          name === "confirmPassword" ? value : formData.confirmPassword;

        if (name === "password") {
          setErrors((prev) => ({
            ...prev,
            password: validatePassword(value),
          }));
        }

        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateIfPasswordsMatch(
            newPassword,
            newConfirmPassword
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
      default:
        break;
    }
  };

  return (
    <div className="login-container">
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Imię"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required={true}
          error={errors.name}
          autoComplete={"given-name"}
          placeholder={"Wpisz imię"}
        />

        <InputField
          label="Nazwisko"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required={true}
          error={errors.lastName}
          autoComplete={"family-name"}
          placeholder={"Wpisz nazwisko"}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required={true}
          error={errors.email}
          autoComplete={"email"}
          placeholder={"Wpisz email"}
        />

        <InputField
          label="Data urodzenia"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required={true}
          error={errors.dateOfBirth}
          autoComplete={"bday"}
        />

        <InputField
          label="Hasło"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={true}
          error={errors.password}
          autoComplete={"new-password"}
          placeholder={"Wpisz hasło"}
        />

        <InputField
          label="Powtórz hasło"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required={true}
          error={errors.confirmPassword}
          autoComplete={"new-password"}
          placeholder={"Powtórz hasło"}
        />

        <InputTextArea
          label="Opis"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder={"Wpisz opis"}
          rows="7"
        />

        <div className="form-group">
          <Link to="/login">Masz już konto? Zaloguj się</Link>
        </div>

        <button
          className="login-button"
          type="submit"
          disabled={
            errors.name ||
            errors.lastName ||
            errors.dateOfBirth ||
            errors.description ||
            errors.email ||
            errors.confirmPassword
          }
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}

export default Register;

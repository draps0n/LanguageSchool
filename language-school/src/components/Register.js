import React, { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

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

  const validateEmail = (email) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Adres email jest wymagany" }));
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Proszę podać prawidłowy adres email",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Hasło nie może być puste" }));
      return false;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Hasło musi zawierać co najmniej 8 znaków, w tym jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const validateIfPasswordsMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Hasła muszą być identyczne",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  };

  const validateName = (name) => {
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Imię nie może być puste" }));
      return false;
    }

    if (name.length < 3) {
      setErrors((prev) => ({
        ...prev,
        name: "Imię musi zawierać co najmniej 3 znaki",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  const validateLastName = (lastName) => {
    if (!lastName) {
      setErrors((prev) => ({
        ...prev,
        lastName: "Naziwsko nie może być puste",
      }));
      return false;
    }

    if (lastName.length < 3) {
      setErrors((prev) => ({
        ...prev,
        lastName: "Imię musi zawierać co najmniej 3 znaki",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, lastName: "" }));
    return true;
  };

  const validateDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: "Data urodzenia jest wymagana",
      }));
      return false;
    }

    if (new Date(dateOfBirth) > new Date()) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: "Data urodzenia nie może być z przyszłości",
      }));
      return false;
    }

    const today = new Date();
    if (
      new Date(dateOfBirth) >
      new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    ) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: "Musisz mieć ukończone 18 lat",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
    return true;
  };

  const validateDescription = (description) => {
    if (!description) {
      setErrors((prev) => ({
        ...prev,
        description: "Opis nie może być pusty",
      }));
      return false;
    }

    if (description.length < 10) {
      setErrors((prev) => ({
        ...prev,
        description: "Opis musi zawierać co najmniej 10 znaków",
      }));
      return false;
    }

    if (description.length > 200) {
      setErrors((prev) => ({
        ...prev,
        description: "Opis nie może zawierać więcej niż 200 znaków",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, description: "" }));
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateIfPasswordsMatch(formData.password, formData.confirmPassword) ||
      !validateName(formData.name) ||
      !validateLastName(formData.lastName) ||
      !validateDateOfBirth(formData.dateOfBirth) ||
      !validateDescription(formData.description)
    ) {
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

    if (name === "email") {
      validateEmail(value);
    }

    if (name === "password" || name === "confirmPassword") {
      const newPassword = name === "password" ? value : formData.password;
      const newConfirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      if (name === "password") {
        validatePassword(value);
      }

      validateIfPasswordsMatch(newPassword, newConfirmPassword);
    }

    if (name === "name") {
      validateName(value);
    }

    if (name === "lastName") {
      validateLastName(value);
    }

    if (name === "dateOfBirth") {
      validateDateOfBirth(value);
    }

    if (name === "description") {
      validateDescription(value);
    }
  };

  return (
    <div className="login-container">
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="login-label" htmlFor="name">
            Imię:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="given-name"
            value={formData.name}
            onChange={handleChange}
            required
            className="login-input"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="login-label" htmlFor="lastName">
            Nazwisko:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="login-input"
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>

        <div className="form-group">
          <label className="login-label" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="login-label" htmlFor="dateOfBirth">
            Data urodzenia:
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            autoComplete="bday"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="login-input"
          />
          {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
        </div>

        <div className="form-group">
          <label className="login-label" htmlFor="password">
            Hasło:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            password="new-password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label className="login-label" htmlFor="confirmPassword">
            Powtórz hasło:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            password="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="login-input"
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="form-group">
          <label className="login-label" htmlFor="description">
            Opis:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="7"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "none",
            }}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

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

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

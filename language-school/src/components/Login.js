import React, { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { validateEmail } from "../util/validators";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";
import { useTranslation } from "react-i18next";
import InputField from "./InputField";

function Login() {
  const { t } = useTranslation();

  // Hook do przechowywania danych użytkownika
  const { setUserData } = useAuth();

  // Hook do nawigacji
  const navigate = useNavigate();

  // Hook do przechowywania informacji o lokalizacji
  const location = useLocation();

  // Pobranie ścieżki, z której użytkownik próbował wejść na stronę logowania
  const { from } = location.state || { from: { pathname: "/profile" } };

  // Hooki do przechowywania danych formularza i błędów
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Funkcja do obsługi zdarzenia submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Wysłanie zapytania do serwera
      const response = await axios.post(
        "/auth/login",
        JSON.stringify({ email: formData.email, password: formData.password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Pobranie tokenu z odpowiedzi serwera i zapisanie go w kontekście
      setUserData(response.data);

      // Usunięcie błędów i przekierowanie na stronę z informacjami o użytkowniku
      setError("");
      setFormData({ email: "", password: "" });
      toast.success(t("loginSuccess"));
      navigate(from, { replace: true });
    } catch (error) {
      if (error && !error.response) {
        setError("Brak odpowiedzi ze strony serwera");
      } else if (error.response.status === 400) {
        setError("Email lub hasło nie zostało podane");
      } else if (error.response.status === 401) {
        setError("Nieprawidłowy email lub hasło");
      } else {
        setError("Logowanie nie powiodło się");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email") {
      setEmailError(validateEmail(value));
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-text">Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label={t("email")}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={emailError}
          required={true}
          autoComplete={"email"}
          placeholder="Wpisz email"
        />

        <InputField
          label={t("password")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={true}
          autoComplete={"current-password"}
          placeholder="Wpisz hasło"
        />
        <div className="form-group">
          <Link to="/register">{t("register")}</Link>
        </div>
        <button
          className="login-button"
          type="submit"
          disabled={!formData.email || !formData.password || emailError !== ""}
        >
          {t("login")}
        </button>
        {error && <p className="error">{t(error)}</p>}
      </form>
    </div>
  );
}

export default Login;

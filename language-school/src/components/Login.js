import React, { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

function Login() {
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

  // Funkcja do walidacji adresu email
  const validateEmail = (email) => {
    if (email === "") {
      setEmailError("");
      return true;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Proszę podać prawidłowy adres email");
      return false;
    }
    setEmailError("");
    return true;
  };

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
      const { accessToken } = response.data;
      setUserData({
        accessToken,
        userId: response.data.userData.userId,
        name: response.data.userData.name,
        lastName: response.data.userData.lastName,
        email: response.data.userData.email,
        roleId: response.data.userData.role,
        dateOfBirth: response.data.userData.dateOfBirth,
      });

      // Usunięcie błędów i przekierowanie na stronę z informacjami o użytkowniku
      setError("");
      setFormData({ email: "", password: "" });
      toast.success("Zalogowano pomyślnie!");
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
      validateEmail(value);
    }
  };

  return (
    <div className="login-container">
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <Link to="/register">Zarejestruj się</Link>
        </div>
        <button
          type="submit"
          disabled={!formData.email || !formData.password || emailError !== ""}
        >
          Zaloguj się
        </button>
      </form>
    </div>
  );
}

export default Login;

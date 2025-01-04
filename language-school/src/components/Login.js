import React from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import "../styles/Login.css";

function Login() {
  const { setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const [emailError, setEmailError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
      const { token } = response.data;
      setUserData({ accessToken: token });
      setError("");
      setFormData({ email: "", password: "" });
      navigate("/user-info");
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
          <Link to="/auth/register">Zarejestruj się</Link>
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

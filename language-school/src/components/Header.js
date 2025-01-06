import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import {
  FaCircleInfo,
  FaSquarePhone,
  FaSchool,
  FaHouseUser,
  FaBook,
} from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Header.css";

function Header() {
  // Pobierz dane użytkownika i funkcję do ich aktualizacji z kontekstu
  const { userData, setUserData } = useAuth();

  // Funkcja do nawigacji
  const navigate = useNavigate();

  // Funkcja do wylogowania użytkownika
  const handleLogout = async () => {
    try {
      // Zapytanie do serwera o wylogowanie
      await axios.get("/auth/logout", { withCredentials: true });

      // Aktualizacja danych użytkownika
      setUserData(null);

      // Wyświetlenie komunikatu o wylogowaniu
      toast.info("Zostałeś wylogowany.");

      // Przekierowanie na stronę główną
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.");
    }
  };

  // Stan do przechowywania informacji o menu w mniejszych rozdzielczościach
  const [menuOpen, setMenuOpen] = useState(false);

  // Funkcja do otwierania/zamykania menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="App-header">
      <nav>
        <div className="logo-container">
          <img src="/favicon.ico" alt="Logo" className="logo" />
          <span className="logo-text">Szkoła Inglisz</span>
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className="link-with-icon">
              Szkoła <FaSchool className="icon" />
            </Link>
          </li>
          <li>
            <Link to="/about" className="link-with-icon">
              O nas <FaCircleInfo className="icon" />
            </Link>
          </li>
          <li>
            <Link to="/contact" className="link-with-icon">
              Kontakt <FaSquarePhone className="icon" />
            </Link>
          </li>
          {userData && (
            <li>
              <Link to="/courses" className="link-with-icon">
                Kursy <FaBook className="icon" />
              </Link>
            </li>
          )}
          {userData && (
            <li>
              <Link to="/profile" className="link-with-icon">
                Profil <FaHouseUser className="icon" />
              </Link>
            </li>
          )}
          <li>
            {userData ? (
              <button onClick={handleLogout}>Wyloguj się</button>
            ) : (
              <button onClick={() => navigate("/login")}>Zaloguj się</button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

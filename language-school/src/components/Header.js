import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import roles from "../constants/roles";
import {
  FaCircleInfo,
  FaSquarePhone,
  FaSchool,
  FaHouseUser,
  FaBook,
  FaUsers,
  FaClipboardList,
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
      console.error(error);
      toast.error("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.");
    }
  };

  // Stan do przechowywania informacji o menu w mniejszych rozdzielczościach
  const [menuOpen, setMenuOpen] = useState(false);

  // Stan do przechowywania informacji o otwarciu menu dla administratora
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Funkcja do otwierania/zamykania menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Funkcja do otwierania/zamykania menu dla administratora
  const toggleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  return (
    <div>
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
            {(!userData || userData?.roleId !== roles.EMPLOYEE) && (
              <>
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
              </>
            )}
            {userData && userData.roleId === roles.EMPLOYEE && (
              <>
                <li>
                  <Link to="/admin/applications" className="link-with-icon">
                    Zgłoszenia <FaClipboardList className="icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className="link-with-icon">
                    Użytkownicy <FaUsers className="icon" />
                  </Link>
                </li>
              </>
            )}
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
                <button className="header-button" onClick={handleLogout}>
                  Wyloguj się
                </button>
              ) : (
                <button
                  className="header-button"
                  onClick={() => navigate("/login")}
                >
                  Zaloguj się
                </button>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;

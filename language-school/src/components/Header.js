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
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  // Pobierz dane użytkownika i funkcję do ich aktualizacji z kontekstu
  const { userData, setUserData } = useAuth();

  // Pobierz tłumaczenia
  const { t, i18n } = useTranslation();

  // Funkcja do nawigacji
  const navigate = useNavigate();

  // Stan do przechowywania akutalnie wybranego języka
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Funkcja do zmiany języka
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
  };

  // Funkcja do wylogowania użytkownika
  const handleLogout = async () => {
    try {
      // Zapytanie do serwera o wylogowanie
      await axios.get("/auth/logout", { withCredentials: true });

      // Aktualizacja danych użytkownika
      setUserData(null);

      // Wyświetlenie komunikatu o wylogowaniu
      toast.info(t("logoutSuccess"));

      // Przekierowanie na stronę główną
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(t("logoutError"));
    }
  };

  // Stan do przechowywania informacji o menu w mniejszych rozdzielczościach
  const [menuOpen, setMenuOpen] = useState(false);

  // Funkcja do otwierania/zamykania menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <header className="App-header">
        <nav>
          <div className="logo-container">
            <img src="/favicon.ico" alt="Logo" className="logo" />
            <span className="logo-text">{t("title")}</span>
            <select
              className="page-language-select"
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="pl">PL</option>
              <option value="en">EN</option>
              <option value="de">DE</option>
            </select>
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
                    {t("school")} <FaSchool className="icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="link-with-icon">
                    {t("about")} <FaCircleInfo className="icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="link-with-icon">
                    {t("contact")} <FaSquarePhone className="icon" />
                  </Link>
                </li>
              </>
            )}
            {userData && userData.roleId === roles.EMPLOYEE && (
              <>
                <li>
                  <Link to="/admin/applications" className="link-with-icon">
                    {t("applications")} <FaClipboardList className="icon" />
                  </Link>
                </li>
                <li>
                  <Link to="/admin/users" className="link-with-icon">
                    {t("users")} <FaUsers className="icon" />
                  </Link>
                </li>
              </>
            )}
            {userData && (
              <li>
                <Link to="/courses" className="link-with-icon">
                  {t("courses")} <FaBook className="icon" />
                </Link>
              </li>
            )}
            {userData && (
              <li>
                <Link to="/profile" className="link-with-icon">
                  {t("profile")} <FaHouseUser className="icon" />
                </Link>
              </li>
            )}
            <li>
              {userData ? (
                <button className="header-button" onClick={handleLogout}>
                  {t("logout")}
                </button>
              ) : (
                <button
                  className="header-button"
                  onClick={() => navigate("/login")}
                >
                  {t("login")}
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

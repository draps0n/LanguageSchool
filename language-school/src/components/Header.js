import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../context/AuthProvider";

function Header() {
  const { userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.log(error); // TODO: popup window
      toast.error("Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.");
    }
  };

  return (
    <header className="App-header">
      <nav>
        <ul>
          <li>
            <Link to="/">Szkoła</Link>
          </li>
          <li>
            <Link to="/about">O nas</Link>
          </li>
          <li>
            <Link to="/contact">Kontakt</Link>
          </li>
          <li>
            {userData ? (
              <button onClick={handleLogout}>Wyloguj się</button>
            ) : (
              <Link to="/login">Zaloguj się</Link>
            )}
          </li>
        </ul>
      </nav>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        toastStyle={{ marginRight: "1rem" }}
        closeButton={false}
      />
    </header>
  );
}

export default Header;

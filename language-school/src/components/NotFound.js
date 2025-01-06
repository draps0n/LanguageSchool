import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Error.css";

const NotFound = () => {
  // Hook do nawigacji
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Not Found</h1>
      <p>Strona której szukasz nie istnieje.</p>
      <br />
      <button className="error-button" onClick={() => navigate(-1)}>
        Wróć
      </button>
    </div>
  );
};

export default NotFound;

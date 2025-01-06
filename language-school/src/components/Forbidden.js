import React from "react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  // Hook do nawigacji
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Forbidden</h1>
      <p>Nie posiadasz uprawnień do wyświetlania tej strony.</p>
      <br />
      <button onClick={() => navigate(-1)}>Wróć</button>
    </div>
  );
};

export default Forbidden;

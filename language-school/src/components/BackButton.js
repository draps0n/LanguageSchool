import React from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa6";

function BackButton() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <button className="small-button" onClick={goBack}>
      <FaAngleLeft className="icon" />
      Wróć
    </button>
  );
}

export default BackButton;

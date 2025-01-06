import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { toast } from "react-toastify";
import "../styles/CourseDeleteConfirmation.css";

function CourseDeleteConfirmation() {
  const navigate = useNavigate();

  const { id } = useParams();

  const axios = useAxiosAuth();

  const goBack = () => {
    navigate(-1);
  };

  const deleteCourse = async () => {
    try {
      await axios.delete(`/groups/${id}`);
      toast.success(`Kurs został usunięty!`);
      navigate("/courses");
    } catch (error) {
      toast.error("Nie udało się usunąć kursu! Spróbuj ponownie.");
    }
  };

  return (
    <div>
      <h2>Czy jesteś pewien, że chcesz usunąć ten kurs?</h2>
      <div className="button-panel">
        <button onClick={deleteCourse} className="small-button delete-button">
          Usuń
        </button>
        <button onClick={goBack} className="small-button">
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default CourseDeleteConfirmation;

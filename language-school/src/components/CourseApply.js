import React, { useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";
import BackButton from "./BackButton";
import {
  validateApplicationComment,
  validateApplicationStartDate,
} from "../util/validators";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

function CourseApply() {
  const axios = useAxiosAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: "",
    comment: "",
  });

  const [errors, setErrors] = useState({
    startDate: "",
    comment: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      validateApplicationStartDate(formData.startDate) ||
      validateApplicationComment(formData.comment)
    ) {
      toast.error("Formularz zawiera błędy");
      return;
    }

    try {
      // Tworzenie obiektu do wysłania
      const toSend = {
        startDate: formData.startDate,
        groupId: id,
      };

      // Dodanie komenatarza jeśli użytkownik podał
      if (formData.comment) {
        toSend.comment = formData.comment;
      }

      // Wysłanie zgłoszenia
      const response = await axios.post(
        `/applications`,
        JSON.stringify(toSend),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // jeśli zgłoszenie zakończyło się sukcesem
      if (response.status === 201) {
        toast.success("Zgłoszenie do grupy językowej zakończone pomyślnie!");
        navigate(`/courses/${id}`);
      } else {
        throw new Error("Error");
      }
    } catch (error) {
      toast.error(
        "Wystąpił błąd podczas zgłaszania. Spróbuj ponownie później."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "startDate") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateApplicationStartDate(value),
      }));
    } else if (name === "comment") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateApplicationComment(value),
      }));
    }
  };

  return (
    <div className="login-container">
      <h1>Zgłoszenie do grupy językowej</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="login-label" htmlFor="startDate">
            Preferowana data rozpoczęcia:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="login-input"
          />
          {errors.startDate && <p className="error">{errors.startDate}</p>}
        </div>

        <div className="form-group">
          <label className="login-label" htmlFor="comment">
            Uwagi: (opcjonalnie)
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="6"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "none",
            }}
          />
          {errors.comment && <p className="error">{errors.comment}</p>}
        </div>
        <div className="form-buttons">
          <BackButton />
          <button
            className="small-button"
            type="submit"
            disabled={errors.startDate || errors.comment || !formData.startDate}
          >
            <FaUserPlus className="icon" />
            Zgłoś się
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseApply;

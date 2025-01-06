import React, { useState } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";
import BackButton from "./BackButton";
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

  const validateStartDate = (startDate) => {
    if (!startDate) {
      setErrors((prev) => ({
        ...prev,
        startDate: "Data rozpoczęcia jest wymagana",
      }));
      return false;
    }

    const today = new Date();
    const nextMonth = new Date();
    const nextWeek = new Date();

    nextMonth.setMonth(today.getMonth() + 1);
    nextWeek.setDate(today.getDate() + 7);

    const startDateDate = new Date(startDate);
    if (startDateDate > nextMonth || startDateDate < nextWeek) {
      setErrors((prev) => ({
        ...prev,
        startDate:
          "Data rozpoczęcia musi być w ciągu najbliższego miesiąca i nie wcześniej niż za tydzień",
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      startDate: "",
    }));

    return true;
  };

  const validateComment = (message) => {
    if (!message) {
      setErrors((prev) => ({
        ...prev,
        comment: "",
      }));
      return true;
    }

    if (message.length < 10 || message.length > 300) {
      setErrors((prev) => ({
        ...prev,
        comment: "Wiadomość zwrotna musi mieć od 10 do 300 znaków",
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      comment: "",
    }));

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateStartDate(formData.startDate) ||
      !validateComment(formData.comment)
    ) {
      console.log("Validation failed");
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
      validateStartDate(value);
    } else if (name === "comment") {
      validateComment(value);
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

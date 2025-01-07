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
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";

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
        <InputField
          label="Preferowana data rozpoczęcia"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required={true}
          error={errors.startDate}
        />

        <InputTextArea
          label="Uwagi: (opcjonalnie)"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          error={errors.comment}
        />

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

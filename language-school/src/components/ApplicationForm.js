import React, { useState, useEffect } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus, FaEdit } from "react-icons/fa";
import BackButton from "./BackButton";
import FormSelect from "./FormSelect";
import { formatDate } from "../util/helpers";
import {
  validateApplicationComment,
  validateApplicationStartDate,
  validateApplicationGroup,
} from "../util/validators";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";
import Loading from "./Loading";

function ApplicationForm() {
  const axios = useAxiosAuth();
  const { id, applicationId } = useParams();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    startDate: "",
    groupId: id || "",
    comment: "",
  });

  const [errors, setErrors] = useState({
    startDate: "",
    comment: "",
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/applications/${applicationId}`);

        if (response.status === 200) {
          const { startDate, groupId, comment } = response.data;
          setFormData({
            startDate: formatDate(startDate),
            groupId,
            comment,
          });
        } else {
          throw new Error("Error");
        }
      } catch (error) {
        toast.error(
          "Wystąpił błąd podczas pobierania danych. Spróbuj ponownie później."
        );
        navigate(`/my-applications`);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get(`/groups/available`);

        if (response.status === 200) {
          setGroups(
            response.data.groups.map((group) => {
              return {
                id: group.id,
                name: `${group.languageCode}-${group.id} - ${group.language} - ${group.level} - ${group.day} - ${group.startTime}-${group.endTime}`,
              };
            })
          );
        } else {
          throw new Error("Error");
        }
      } catch (error) {
        toast.error(
          "Wystąpił błąd podczas pobierania danych. Spróbuj ponownie później."
        );
        console.error(error);
      }
    };

    if (applicationId) {
      fetchApplication();
      fetchGroups();
    }
  }, [axios, applicationId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      validateApplicationStartDate(formData.startDate) ||
      validateApplicationComment(formData.comment) ||
      (!id && validateApplicationGroup(formData.groupId))
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

      if (!id) {
        toSend.groupId = formData.groupId;
        const response = await axios.put(
          `/applications/${applicationId}`,
          toSend
        );

        if (response.status === 204) {
          toast.success(
            "Zgłoszenie do grupy językowej zaktualizowane pomyślnie!"
          );
          navigate(`/my-applications`);
        } else {
          throw new Error("Error");
        }
      } else {
        // Wysłanie zgłoszenia
        const response = await axios.post(`/applications`, toSend);

        // jeśli zgłoszenie zakończyło się sukcesem
        if (response.status === 201) {
          toast.success("Zgłoszenie do grupy językowej zakończone pomyślnie!");
          navigate(`/courses/${id}`);
        } else {
          throw new Error("Error");
        }
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
    } else if (name === "groupId") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateApplicationGroup(value),
      }));
    }
  };

  if (applicationId && !formData.startDate) {
    return <Loading />;
  }

  return (
    <div className="login-container">
      {id ? (
        <h1>Zgłoszenie do grupy językowej</h1>
      ) : (
        <h1>Edycja zgłoszenia do grupy językowej</h1>
      )}
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

        {!id && (
          <FormSelect
            label="Grupa językowa"
            name="groupId"
            value={formData.groupId}
            options={groups}
            onChange={handleChange}
            required={true}
          ></FormSelect>
        )}

        <InputTextArea
          label="Uwagi: (opcjonalnie)"
          name="comment"
          value={formData.comment || ""}
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
            {id && <FaUserPlus className="icon" />}
            {id ? "Zgłoś się" : "Zapisz zmiany"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;

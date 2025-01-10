import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import BackButton from "./BackButton";
import daysOfWeek from "../constants/daysOfWeek";
import {
  validateGroupPlaces,
  validateGroupDescription,
  validateGroupPrice,
  validateGroupTeacher,
  validateGroupLanguage,
  validateGroupLevel,
  validateGroupDayOfWeek,
  validateGroupTime,
} from "../util/validators";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";
import "../styles/Login.css";
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";
import FormSelect from "./FormSelect";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";

function CourseForm() {
  const { t } = useTranslation();

  // Hook do pobrania axios'a z autoryzacją
  const axios = useAxiosAuth();

  // Hook do nawigacji
  const navigate = useNavigate();

  // Id edytowanej grupy
  const { id } = useParams();

  // Stan do przechowywania danych formularza
  const [formData, setFormData] = useState({
    places: 0,
    description: "",
    price: 0,
    teacher: {
      id: "",
      name: "",
      lastName: "",
    },
    language: {
      id: "",
      name: "",
      code: "",
    },
    level: {
      id: "",
      name: "",
    },
    day: {
      id: "",
      name: "",
    },
    startTime: "",
    endTime: "",
  });

  // Stan do przechowywania początkowych danych edytowanej grupy
  const [group, setGroup] = useState({});

  // Stan do przechowywania błędów
  const [errors, setErrors] = useState({
    places: "",
    description: "",
    price: "",
    teacher: "",
    language: "",
    level: "",
    day: "",
    time: "",
  });

  // Stany do przechowywania danych z serwera
  const [teachers, setTeachers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);

  // Pobranie danych z serwera
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/teachers");
        setTeachers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get("/languages");
        setLanguages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLevels = async () => {
      try {
        const response = await axios.get("/levels");
        setLevels(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/groups/${id}`);

        setGroup({
          places: response.data.group.places,
          description: response.data.group.description,
          price: response.data.group.price,
          teacherId: response.data.group.teacher.id,
          languageId: response.data.group.language.id,
          levelId: response.data.group.level.id,
          day: response.data.group.day.name,
          startTime: response.data.group.startTime,
          endTime: response.data.group.endTime,
          code: response.data.group.language.code,
        });

        setFormData({
          places: response.data.group.places,
          description: response.data.group.description,
          price: response.data.group.price,
          teacher: {
            id: response.data.group.teacher.id,
            name: response.data.group.teacher.name,
            lastName: response.data.group.teacher.lastName,
          },
          language: {
            id: response.data.group.language.id,
            name: response.data.group.language.name,
            code: response.data.group.language.code,
          },
          level: {
            id: response.data.group.level.id,
            name: response.data.group.level.name,
          },
          day: {
            id: daysOfWeek.find((d) => d.name === response.data.group.day).id,
            name: response.data.group.day.name,
          },
          startTime: response.data.group.startTime,
          endTime: response.data.group.endTime,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeachers();
    fetchLanguages();
    fetchLevels();

    if (id) fetchCourse();
  }, [id, axios]);

  // Obsługa zmiany wartości w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startTime") {
      setErrors({
        ...errors,
        time: validateGroupTime(value, formData.endTime),
      });
    } else if (name === "endTime") {
      setErrors({
        ...errors,
        time: validateGroupTime(formData.startTime, value),
      });
    } else if (name === "places") {
      setErrors({
        ...errors,
        places: validateGroupPlaces(value),
      });
    } else if (name === "description") {
      setErrors({
        ...errors,
        description: validateGroupDescription(value),
      });
    } else if (name === "price") {
      setErrors({
        ...errors,
        price: validateGroupPrice(value),
      });
    } else if (name === "teacher") {
      setErrors({
        ...errors,
        teacher: validateGroupTeacher(value),
      });
    } else if (name === "language") {
      setErrors({
        ...errors,
        language: validateGroupLanguage(value),
      });
    } else if (name === "level") {
      setErrors({
        ...errors,
        level: validateGroupLevel(value),
      });
    } else if (name === "day") {
      setErrors({
        ...errors,
        day: validateGroupDayOfWeek(value),
      });
    }

    if (name === "teacher") {
      const teacher = teachers.find(
        (teacher) => teacher.id === parseInt(value)
      );
      setFormData({
        ...formData,
        teacher,
      });
    } else if (name === "language") {
      const language = languages.find(
        (language) => language.id === parseInt(value)
      );
      setFormData({
        ...formData,
        language,
      });
    } else if (name === "level") {
      const level = levels.find((level) => level.id === parseInt(value));
      setFormData({
        ...formData,
        level,
      });
    } else if (name === "day") {
      const day = daysOfWeek.find((day) => day.id === parseInt(value));
      setFormData({
        ...formData,
        day,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Obsługa wysłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja formularza
    if (
      validateGroupPlaces(formData.places) ||
      validateGroupDescription(formData.description) ||
      validateGroupPrice(formData.price) ||
      validateGroupTeacher(formData.teacher) ||
      validateGroupLanguage(formData.language) ||
      validateGroupLevel(formData.level) ||
      validateGroupDayOfWeek(formData.day) ||
      validateGroupTime(formData.startTime, formData.endTime)
    ) {
      toast.error(t("formContainsErrors"));
      return;
    }

    // Dane do wysłania
    const toSend = {
      places: formData.places,
      description: formData.description,
      price: formData.price,
      teacherId: formData.teacher.id,
      languageId: formData.language.id,
      levelId: formData.level.id,
      day: formData.day.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    // Sprawdzenie czy wprowadzono zmiany
    if (
      toSend.places === group.places &&
      toSend.description === group.description &&
      toSend.price === group.price &&
      toSend.teacherId === group.teacherId &&
      toSend.languageId === group.languageId &&
      toSend.levelId === group.levelId &&
      toSend.day === group.day &&
      toSend.startTime === group.startTime &&
      toSend.endTime === group.endTime
    ) {
      toast.error(t("noChangesMade"));
      return;
    }

    // Wysłanie danych na serwer
    try {
      if (id) {
        await axios.put(`/groups/${id}`, toSend);
        toast.success(t("groupUpdated"));
      } else {
        await axios.post("/groups", toSend);
        toast.success(t("groupAdded"));
      }
      navigate(`/courses/${id}`);
    } catch (error) {
      toast.error(t("errorSavingData") + " " + t("tryAgainLater"));
      console.error(error);
    }
  };

  // Sprawdzenie czy dane zostały już pobrane, jeśli podczas edycji
  if (id && !group.places) {
    return <Loading />;
  }

  return (
    <div className="login-container">
      <h1 className="login-text">
        {id
          ? `${t("editLanguageGroup")}: ${group.code}-${id}`
          : t("addLanguageGroup")}
      </h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label={t("numberOfPlaces")}
          name="places"
          type="number"
          value={formData.places}
          onChange={handleChange}
          required={true}
          error={errors.places}
          placeholder="6-20"
        />

        <InputTextArea
          label={t("description")}
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          required={true}
          error={errors.description}
          placeholder={t("groupDescriptionPlaceholder")}
          rows={5}
        />

        <InputField
          label={t("priceForClasses")}
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required={true}
          error={errors.price}
          placeholder="0.00"
        />

        <FormSelect
          label={t("teacher")}
          name="teacher"
          value={formData.teacher.id || ""}
          onChange={handleChange}
          options={teachers}
          error={errors.teacher}
        />

        <FormSelect
          label={t("language")}
          name="language"
          value={formData.language.id || ""}
          onChange={handleChange}
          options={languages}
          error={errors.language}
          shouldTranslateName={true}
        />

        <FormSelect
          label={t("level")}
          name="level"
          value={formData.level.id || ""}
          onChange={handleChange}
          options={levels}
          error={errors.level}
        />

        <FormSelect
          label={t("dayOfWeek")}
          name="day"
          value={formData.day.id || ""}
          onChange={handleChange}
          options={daysOfWeek}
          error={errors.day}
          shouldTranslateName={true}
        />

        <InputField
          label={t("startTime")}
          name="startTime"
          type="time"
          value={formData.startTime}
          onChange={handleChange}
          required={true}
        />

        <InputField
          label={t("endTime")}
          name="endTime"
          type="time"
          value={formData.endTime}
          onChange={handleChange}
          required={true}
          error={errors.time}
        />

        <div className="form-buttons">
          <BackButton />
          <button
            className="small-button"
            type="submit"
            disabled={
              errors.places ||
              errors.description ||
              errors.price ||
              errors.teacher ||
              errors.language ||
              errors.level ||
              errors.day ||
              errors.time
            }
          >
            <FaSave className="icon" />
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;

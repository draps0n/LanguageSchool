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
} from "../utils/validators";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";
import FormSelect from "./FormSelect";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";

function CourseForm() {
  const { t } = useTranslation();

  const [generalError, setGeneralError] = useState("");

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
    teacher: "",
    language: "",
    level: "",
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
        const response = await axios.get("/languages/taught");
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
          teacher: response.data.group.teacher.id,
          language: response.data.group.language.id,
          level: response.data.group.level.id,
          day: {
            id: daysOfWeek.find((d) => d.name === response.data.group.day).id,
            name: response.data.group.day,
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
        language: validateGroupLanguage(value, teachers),
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

    if (name === "teacher" || name === "language" || name === "level") {
      setFormData({
        ...formData,
        [name]: parseInt(value),
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
      validateGroupLanguage(formData.language, teachers) ||
      validateGroupLevel(formData.level) ||
      validateGroupDayOfWeek(formData.day) ||
      validateGroupTime(formData.startTime, formData.endTime)
    ) {
      toast.error(t("formContainsErrors"));
      setGeneralError(t("formContainsErrors"));
      return;
    }

    // Dane do wysłania
    const toSend = {
      places: formData.places,
      description: formData.description,
      price: formData.price,
      teacherId: formData.teacher,
      languageId: formData.language,
      levelId: formData.level,
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
      setGeneralError(t("noChangesMade"));
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
      if (error?.response?.status === 400) {
        toast.error(t("formContainsErrors"));
        setGeneralError(t("formContainsErrors"));
        return;
      } else if (error?.response?.status === 409) {
        if (
          error.response?.data?.message ===
          "Cannot set places to less than taken places"
        ) {
          toast.error(t("groupHasMoreStudentsThanPlaces"));
          setGeneralError(t("groupHasMoreStudentsThanPlaces"));
        } else {
          toast.error(t("teacherCannotTeachThisLanguage"));
          setGeneralError(t("teacherCannotTeachThisLanguage"));
        }
      } else {
        toast.error(t("errorSavingData") + " " + t("tryAgainLater"));
        setGeneralError(t("errorSavingData") + " " + t("tryAgainLater"));
      }
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
          label={t("language")}
          name="language"
          value={formData.language || 0}
          onChange={handleChange}
          options={languages}
          error={errors.language}
          shouldTranslateName={true}
        />

        <FormSelect
          label={t("teacher")}
          name="teacher"
          value={formData.teacher || 0}
          onChange={handleChange}
          options={teachers.filter((teacher) =>
            teacher.languages.map((l) => l.id).includes(formData.language)
          )}
          error={errors.teacher}
          disabled={!formData.language}
        />

        <FormSelect
          label={t("level")}
          name="level"
          value={formData.level || 0}
          onChange={handleChange}
          options={levels}
          error={errors.level}
        />

        <FormSelect
          label={t("dayOfWeek")}
          name="day"
          value={formData.day.id || 0}
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

        {generalError && <p className="error">{generalError}</p>}

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

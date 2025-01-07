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

function CourseForm() {
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
    day: "",
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
          day: response.data.group.day,
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
          day: response.data.group.day,
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
      toast.error("Formularz zawiera błędy!");
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
      day: formData.day,
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
      toast.error("Nie wprowadzono zmian");
      return;
    }

    // Wysłanie danych na serwer
    try {
      if (id) {
        await axios.put(`/groups/${id}`, toSend);
        toast.success("Zaktualizowano grupę");
      } else {
        await axios.post("/groups", toSend);
        toast.success("Dodano nową grupę");
      }
      navigate(`/courses/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // Sprawdzenie czy dane zostały już pobrane, jeśli podczas edycji
  if (id && !group.places) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="login-container">
      <h1 className="login-text">
        Edycja grupy językowej: {group.code}-{id}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="login-label">Liczba miejsc:</label>
          <input
            className="login-input"
            type="number"
            name="places"
            value={formData.places || ""}
            onChange={handleChange}
            required
            placeholder="6-20"
          />
          {errors.places && <p className="error">{errors.places}</p>}
        </div>
        <div className="form-group">
          <label className="login-label">Opis:</label>
          <input
            className="login-input"
            type="text"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            required
            placeholder="Opis grupy (5-250 znaków)"
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div className="form-group">
          <label className="login-label">Cena zajęć:</label>
          <input
            className="login-input"
            type="number"
            step="0.01"
            name="price"
            value={formData.price || ""}
            placeholder="0.00"
            onChange={handleChange}
            required
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        <div className="form-group">
          <label className="login-label">Nauczyciel:</label>
          <select
            className="login-input"
            name="teacher"
            onChange={handleChange}
            value={formData.teacher.id || ""}
          >
            <option value="" disabled hidden>
              Wybierz nauczyciela
            </option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name + " " + teacher.lastName}
              </option>
            ))}
          </select>
          {errors.teacher && <p className="error">{errors.teacher}</p>}
        </div>

        <div className="form-group">
          <label className="login-label">Język:</label>
          <select
            className="login-input"
            name="language"
            value={formData.language.id || ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Wybierz język
            </option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          {errors.language && <p className="error">{errors.language}</p>}
        </div>

        <div className="form-group">
          <label className="login-label">Poziom:</label>
          <select
            className="login-input"
            name="level"
            onChange={handleChange}
            value={formData.level.id || ""}
          >
            <option value="" disabled hidden>
              Wybierz poziom
            </option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
          {errors.level && <p className="error">{errors.level}</p>}
        </div>

        <div className="form-group">
          <label className="login-label">Dzień tygodnia:</label>
          <select
            className="login-input"
            name="day"
            onChange={handleChange}
            value={formData.day || ""}
          >
            <option value="" disabled hidden>
              Wybierz dzień tygodnia
            </option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.day && <p className="error">{errors.day}</p>}
        </div>

        <div className="form-group">
          <label className="login-label">Godzina rozpoczęcia:</label>
          <input
            className="login-input"
            type="time"
            name="startTime"
            value={formData.startTime || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="login-label">Godzina zakończenia:</label>
          <input
            className="login-input"
            type="time"
            name="endTime"
            value={formData.endTime || ""}
            onChange={handleChange}
            required
          />
        </div>
        {errors.time && <p className="error">{errors.time}</p>}
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
            Zapisz
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;

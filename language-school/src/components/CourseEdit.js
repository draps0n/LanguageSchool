import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import BackButton from "./BackButton";
import daysOfWeek from "../constants/daysOfWeek";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";
import "../styles/Login.css";

function CourseEdit() {
  const navigate = useNavigate();

  // Id edytowanej grupy
  const { id } = useParams();

  // Stan do przechowywania danych edytowanej grupy
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

  // Stan do przechowywania danych formularza
  const [formData, setFormData] = useState({
    places: 0,
    description: "",
    price: "",
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

  // Hook do pobrania axios'a z autoryzacją
  const axios = useAxiosAuth();

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
          endTime: response.data.group,
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
    fetchCourse();
  }, [id, axios]);

  const validators = {
    places: (places) => {
      if (!places) {
        setErrors({
          ...errors,
          places: "Liczba miejsc jest wymagana",
        });
        return false;
      }

      if (places < 6) {
        setErrors({
          ...errors,
          places: "Liczba miejsc nie może być mniejsza od 6",
        });
        return false;
      }

      if (places > 20) {
        setErrors({
          ...errors,
          places: "Liczba miejsc nie może być większa od 20",
        });
        return false;
      }

      setErrors({
        ...errors,
        places: "",
      });
      return true;
    },
    description: (description) => {
      if (!description) {
        setErrors({
          ...errors,
          description: "Opis jest wymagany",
        });
        return false;
      }

      if (description.length < 5) {
        setErrors({
          ...errors,
          description: "Opis musi zawierać co najmniej 5 znaków",
        });
        return false;
      }

      if (description.length > 250) {
        setErrors({
          ...errors,
          description: "Opis nie może przekraczać 250 znaków",
        });
        return false;
      }

      setErrors({
        ...errors,
        description: "",
      });
      return true;
    },
    price: (price) => {
      if (!price) {
        setErrors({
          ...errors,
          price: "Cena jest wymagana",
        });
        return false;
      }

      if (price < 0) {
        setErrors({
          ...errors,
          price: "Cena nie może być ujemna",
        });
        return false;
      }

      setErrors({
        ...errors,
        price: "",
      });
      return true;
    },
    teacher: (teacher) => {
      if (!teacher) {
        setErrors({
          ...errors,
          teacher: "Nauczyciel jest wymagany",
        });
        return false;
      }

      // TODO : czy znów sprawdzać?

      setErrors({
        ...errors,
        teacher: "",
      });
      return true;
    },
    language: (language) => {
      if (!language) {
        setErrors({
          ...errors,
          language: "Język jest wymagany",
        });
        return false;
      }

      setErrors({
        ...errors,
        language: "",
      });
      return true;
    },
    level: (level) => {
      if (!level) {
        setErrors({
          ...errors,
          level: "Poziom jest wymagany",
        });
        return false;
      }

      setErrors({
        ...errors,
        level: "",
      });
      return true;
    },
    day: (day) => {
      if (!day) {
        setErrors({
          ...errors,
          day: "Dzień tygodnia jest wymagany",
        });
        return false;
      }

      setErrors({
        ...errors,
        day: "",
      });
      return true;
    },
    time: (name, value) => {
      if (!value) {
        setErrors({
          ...errors,
          time: "Godzina rozpoczęcia i zakończenia są wymagane",
        });
      }

      const startTime = name === "startTime" ? value : formData.startTime;
      const endTime = name === "endTime" ? value : formData.endTime;

      if (startTime >= endTime) {
        setErrors({
          ...errors,
          time: "Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia",
        });
      } else if (endTime <= startTime) {
        setErrors({
          ...errors,
          time: "Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia",
        });
      } else {
        setErrors({
          ...errors,
          time: "",
        });
      }
    },
  };

  // Obsługa zmiany wartości w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      validators.time(name, value);
    } else {
      validators[name](value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // TODO : logikę do wysyłania danych na serwer
    try {
      await axios.put(`/groups/${id}`, toSend);
      toast.success("Zaktualizowano grupę");
      navigate(`/courses/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!group.places) {
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
            value={formData.places}
            onChange={handleChange}
            required
          />
          {errors.places && <p className="error">{errors.places}</p>}
        </div>
        <div className="form-group">
          <label className="login-label">Opis:</label>
          <input
            className="login-input"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
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
            value={formData.price}
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
            value={formData.teacher.id}
          >
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
            value={formData.language.id}
            onChange={handleChange}
          >
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
            value={formData.level.id}
          >
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
            value={formData.day}
          >
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
            value={formData.startTime}
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
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
        {errors.time && <p className="error">{errors.time}</p>}
        <div className="form-buttons">
          <BackButton />
          <button className="small-button" type="submit">
            <FaSave className="icon" />
            Zapisz
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseEdit;

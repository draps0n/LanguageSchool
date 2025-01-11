import React, { useState, useEffect } from "react";
import useAxiosAuth from "../hooks/useAxiosAuth";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";
import BackButton from "./BackButton";
import FormSelect from "./FormSelect";
import { formatDate } from "../utils/helpers";
import {
  validateApplicationComment,
  validateApplicationStartDate,
  validateApplicationGroup,
} from "../utils/validators";
import "react-toastify/dist/ReactToastify.css";
import InputField from "./InputField";
import InputTextArea from "./InputTextArea";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";

function ApplicationForm() {
  const { t } = useTranslation();
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
        toast.error(t("errorWhileFetchingData") + t("tryAgainLater"));
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
                name: `${group.languageCode}-${group.id} - ${t(
                  group.language
                )} - ${group.level} - ${t(group.day)} - ${group.startTime}-${
                  group.endTime
                }`,
              };
            })
          );
        } else {
          throw new Error("Error");
        }
      } catch (error) {
        toast.error(t("errorWhileFetchingData") + t("tryAgainLater"));
        console.error(error);
      }
    };

    if (applicationId) {
      fetchApplication();
      fetchGroups();
    }
  }, [axios, applicationId, navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      validateApplicationStartDate(formData.startDate) ||
      validateApplicationComment(formData.comment) ||
      (!id && validateApplicationGroup(formData.groupId))
    ) {
      toast.error(t("formContainsErrors"));
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
          toast.success(t("applicationEdited"));
          navigate(`/my-applications`);
        } else {
          throw new Error("Error");
        }
      } else {
        // Wysłanie zgłoszenia
        const response = await axios.post(`/applications`, toSend);

        // jeśli zgłoszenie zakończyło się sukcesem
        if (response.status === 201) {
          toast.success(t("applicationAdded"));
          navigate(`/courses/${id}`);
        } else {
          throw new Error("Error");
        }
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error(t("formContainsErrors"));
      } else if (error?.response?.status === 409) {
        if (error?.response?.data?.message === "Group is full") {
          toast.error(t("groupIsFull"));
        } else {
          console.log(error.response.data);
          toast.error(t("userAlreadyApplied"));
        }
      } else {
        toast.error(t("errorWhileSendingData") + t("tryAgainLater"));
      }
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
        <h1>{t("applicationFormAdd")}</h1>
      ) : (
        <h1>{t("applicationFormEdit")}</h1>
      )}
      <form onSubmit={handleSubmit}>
        <InputField
          label={t("preferredStartDate")}
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required={true}
          error={errors.startDate}
        />

        {!id && (
          <FormSelect
            label={t("languageGroup")}
            name="groupId"
            value={formData.groupId}
            options={groups}
            onChange={handleChange}
            required={true}
          ></FormSelect>
        )}

        <InputTextArea
          label={t("comments") + " (" + t("optional") + ")"}
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
            {id ? t("apply") : t("saveEdit")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;

import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/InputField.css";

function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  error,
  shouldTranslateName = false,
}) {
  const { t } = useTranslation();
  return (
    <div className="form-group">
      <label className="input-label" htmlFor={name}>
        {label}:
      </label>
      <select
        id={name}
        className="input-field"
        name={name}
        value={value || ""}
        onChange={onChange}
      >
        <option key={0} value="" disabled hidden className="placeholder-option">
          {t("choose")} {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {(shouldTranslateName ? t(option.name) : option.name) +
              (option?.lastName ? ` ${option.lastName}` : "")}
          </option>
        ))}
      </select>
      {error && <p className="input-field-error">{t(error)}</p>}
    </div>
  );
}

export default FormSelect;

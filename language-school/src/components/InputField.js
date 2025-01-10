import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/InputField.css";

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  step,
  autoComplete,
  readOnly = false,
  disabled = false,
  checked = false,
}) {
  const { t } = useTranslation();
  return (
    <div className="form-group">
      <label className="input-label" htmlFor={name}>
        {label}:
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        step={step}
        autoComplete={autoComplete}
        className="input-field"
        readOnly={readOnly}
        disabled={disabled}
        checked={checked}
      />
      {error && <p className="input-field-error">{t(error)}</p>}
    </div>
  );
}

export default InputField;

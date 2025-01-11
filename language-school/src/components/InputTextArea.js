import React from "react";
import { useTranslation } from "react-i18next";

function InputTextArea({
  label,
  name,
  value,
  onChange,
  readOnly,
  error,
  rows,
}) {
  const { t } = useTranslation();
  return (
    <div className="form-group">
      <label className="input-label" htmlFor={name}>
        {label}:
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        rows={rows}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "none",
        }}
      ></textarea>
      {error && <p className="input-field-error">{t(error)}</p>}
    </div>
  );
}

export default InputTextArea;

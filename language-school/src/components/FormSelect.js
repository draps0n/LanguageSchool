import React from "react";
import "../styles/InputField.css";

function FormSelect({ label, name, value, onChange, options, error }) {
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
        <option value="" disabled hidden className="placeholder-option">
          Wybierz {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name + (option?.lastName ? ` ${option.lastName}` : "")}
          </option>
        ))}
      </select>
      {error && <p className="input-field-error">{error}</p>}
    </div>
  );
}

export default FormSelect;

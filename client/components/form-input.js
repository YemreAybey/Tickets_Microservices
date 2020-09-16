import { ErrorMessage } from "@hookform/error-message";

const FormInput = ({ name, label, defaultValue, reference, errors, type }) => {
  const divStyle = {
    borderColor: errors[name] ? "red" : "initial",
  };

  const errorStyle = {
    color: "red",
    fontSize: "11px",
  };

  return (
    <div className="form-roup my-2">
      <label>{label}</label>
      <input
        name={name}
        defaultValue={defaultValue || ""}
        ref={reference}
        className="form-control"
        style={divStyle}
        type={type || "text"}
      />
      <span style={errorStyle}>{errors[name]?.message}</span>
    </div>
  );
};

export default FormInput;

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Auth.scss";
import { useDispatch } from "react-redux";
import { registerAction } from "../../store/authSlice";
import { Link } from "react-router-dom";
function Register() {
  const dispatch = useDispatch();
  const rules = ["owner", "client", "user"];
  const fields = ["first name", "last name", "email", "password"];
  const [inputFocus, setInputFocus] = useState("");

  const [activeRadio, setActiveRadio] = useState("user");
  const formik = useFormik({
    initialValues: {},
    validationSchema: yup.object({
      firstName: yup
        .string("Only Letters is allowed")
        .required("first name is required"),
      lastName: yup.string().required("last name is required"),
      email: yup.string().email().required(),
      password: yup.string().required(),
      rules: yup.string(),
    }),
    onSubmit(values) {
      dispatch(registerAction({ values }));
    },
  });
  return (
    <div className="auth_page">
      <div className="square-box">
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
      </div>
      <div className="box">
        <div className="logo">logo</div>
        <div className="text">sign up to continue</div>
        <form onSubmit={formik.handleSubmit}>
          {fields?.map((item, i) => (
            <div className="form-group">
              <span class="bar"></span>
              <label class={`label ${inputFocus === item ? "active" : ""}`}>
                {item.split("").map((litter, i) => (
                  <span key={i} class="label-char" style={{ "--index": i }}>
                    {litter}
                  </span>
                ))}
              </label>
              <input
                type={item}
                name={item}
                className="input"
                // placeholder="password"
                onChange={formik.handleChange}
                onFocus={() => setInputFocus(item)}
              />
              <div className="alert">{formik.errors.password}</div>
            </div>
          ))}
          <div className="radio-group">
            <div className="label">rules</div>
            <div className="items">
              {rules.map((item, i) => (
                <div
                  key={i}
                  className={activeRadio === item ? "radio active" : "radio"}
                  onClick={() => setActiveRadio(item)}>
                  <div className="square"></div>
                  <div className="text">{item}</div>
                </div>
              ))}
            </div>
          </div>
          <button type="submit">register</button>
        </form>
        <div className="block">
          <div>
            have an account? <Link to="/auth/login">log in so!</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

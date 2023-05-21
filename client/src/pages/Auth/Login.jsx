import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Auth.scss";
import { useDispatch } from "react-redux";
import { registerAction } from "../../store/authSlice";
import { Link } from "react-router-dom";
function Login() {
  const dispatch = useDispatch();
  const fields = ["email", "password"];
  const [inputFocus, setInputFocus] = useState("");
  const formik = useFormik({
    initialValues: {},
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
    onSubmit(values) {
      dispatch(registerAction({ values }));
    },
  });
  const func = () => {
    let text = "mohammed";
    console.log(text.split(""));
  };
  func();

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

          <button type="submit">login</button>
        </form>
        <div className="block">
          <div>
            don't have an account?{" "}
            <Link to="/auth/register">create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

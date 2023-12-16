import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Auth.scss";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, logoutAction, reset } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Stack, TextField, Alert } from "@mui/material";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errors, errorMessage, user } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {},
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
    onSubmit(values) {
      dispatch(loginAction(values));
    },
  });
  useEffect(() => {
    dispatch(reset());
    if (user) {
      navigate("/dashboard/business/new");
    }
  }, [user]);

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
          {errors && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              {errors?.map((error) => {
                return Object.keys(error).map((key) => {
                  return error[key].map((errorMessage, index) => (
                    <div className="error" key={`${key}-${index}`}>
                      <strong>{key}:</strong> {errorMessage}
                    </div>
                  ));
                });
              })}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              {errorMessage}
            </Alert>
          )}
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            marginBottom={2}>
            <TextField
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.email)}
              helperText={formik.errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  outlineColor: "transparent",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7b2cbfff !important",
                },
                "& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused": {
                  color: "#7b2cbfff",
                },
              }}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.password)}
              helperText={formik.errors.password}
              sx={{
                "& .MuiOutlinedInput-root": {
                  outlineColor: "transparent",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7b2cbfff !important",
                },
                "& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused": {
                  color: "#7b2cbfff",
                },
              }}
            />
          </Box>
          <Button type="submit">Login</Button>
          {/* <Button onClick={() => dispatch(logoutAction())}>logout</Button> */}
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

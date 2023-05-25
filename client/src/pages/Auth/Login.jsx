import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Auth.scss";
import { useDispatch } from "react-redux";
import { loginAction, logoutAction } from "../../store/authSlice";
import { Link } from "react-router-dom";
import { Box, Button, Stack, TextField } from "@mui/material";
function Login() {
  const dispatch = useDispatch();

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
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7b2cbfff", // Replace 'red' with your desired color
                },
                "& .MuiInputLabel-root": {
                  color: "#7b2cbfff", // Replace 'green' with your desired color
                },
              }}
            />
            <TextField
              name="password"
              label="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.password)}
              helperText={formik.errors.password}
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7b2cbfff", // Replace 'red' with your desired color
                },
                "& .MuiInputLabel-root": {
                  color: "#7b2cbfff", // Replace 'green' with your desired color
                },
              }}
            />
          </Box>
          <Button type="submit">Login</Button>
          <Button onClick={() => dispatch(logoutAction())}>logout</Button>
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

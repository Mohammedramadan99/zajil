import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Auth.scss";
import { useDispatch, useSelector } from "react-redux";
import { registerAction, reset } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SquareAnimation from "./SquareAnimation";
function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errors, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );
  const formik = useFormik({
    initialValues: {},
    validationSchema: yup.object({
      firstName: yup
        .string("Only Letters is allowed")
        .required("first name is required"),
      lastName: yup.string().required("last name is required"),
      email: yup.string().email().required(),
      password: yup.string().required(),
      roles: yup.string().required("roles is required"),
    }),
    onSubmit(values) {
      const roles = [values.roles];
      const data = { ...values, roles };
      dispatch(registerAction(data));
    },
  });
  useEffect(() => {
    dispatch(reset());
  }, []);
  if (successMessage) {
    navigate("/auth/login");
  }
  return (
    <div className="auth_page">
      <SquareAnimation />
      <div className="box">
        <div className="logo">logo</div>
        <div className="text">sign up to continue</div>
        <form onSubmit={formik.handleSubmit}>
          {errors && (
            <Alert severity="error" sx={{ marginBottom: 4 }}>
              {errors.map((error) => {
                return Object.keys(error).map((key) => {
                  return error[key].map((errorMsg, index) => (
                    <div className="error" key={`${key}-${index}`}>
                      <strong>{key}:</strong> {errorMsg}
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
            <Stack direction={"row"} spacing={2}>
              <TextField
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.firstName)}
                helperText={formik.errors.firstName}
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
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.lastName)}
                helperText={formik.errors.lastName}
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
            </Stack>
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
            <RadioGroup
              row
              defaultValue={formik.values.roles}
              name="roles"
              onChange={formik.handleChange}
              sx={{ flexDirection: "column" }}
              // sx={{ flexDirection: "column" }}
            >
              <FormLabel sx={{ marginRight: "20px" }}>Roles</FormLabel>
              <Box>
                <FormControlLabel
                  value="admin"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#7b2cbfff",
                        "&.Mui-checked": {
                          color: "#7b2cbfff",
                        },
                      }}
                    />
                  }
                  label="admin"
                />
                <FormControlLabel
                  value="business_owner"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#7b2cbfff",
                        "&.Mui-checked": {
                          color: "#7b2cbfff",
                        },
                      }}
                    />
                  }
                  label="business owner"
                />
                <FormControlLabel
                  value="employee"
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#7b2cbfff",
                        "&.Mui-checked": {
                          color: "#7b2cbfff",
                        },
                      }}
                    />
                  }
                  label="employee"
                />
              </Box>
              {formik.errors.roles && (
                <Typography variant="body2" color={"#d32f2f"}>
                  {" "}
                  {formik.errors.roles}{" "}
                </Typography>
              )}
            </RadioGroup>
          </Box>
          <Button type="submit">Register</Button>
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

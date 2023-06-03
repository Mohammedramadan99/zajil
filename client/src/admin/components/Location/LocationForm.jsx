import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function LocationForm() {
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      name: "",
      message: "",
      location: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("name is required").min(3),
      message: yup.string().required("message is required"),
      location: yup.string().required("message is required"),
    }),
    onSubmit: (values) => {
      //   onSave(params);
    },
  });
  return (
    <>
      <Stack direction={"column"} spacing={1}>
        <Typography variant="h2"> Location </Typography>
        <Typography variant="body2">
          {" "}
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis
          accusamus perspiciatis explicabo culpa facere molestias hic earum
          vitae.{" "}
        </Typography>
        <Button variant="contained" sx={{ width: "100%" }}>
          More Locations
        </Button>
      </Stack>
      <Stack
        mt={3}
        p={2}
        sx={{
          backgroundColor: theme.palette.grey[900],
        }}>
        <Typography variant="h5" textTransform={"capitalize"} mb={2}>
          add location
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Stack direction={"column"} spacing={2}>
            <TextField
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.name)}
              helperText={formik.errors.name}
            />
            <TextField
              name="message"
              label="Message"
              value={formik.values.message}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.message)}
              helperText={formik.errors.message}
            />
            <TextField
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.location)}
              helperText={formik.errors.location}
            />
          </Stack>
          <Button
            // disabled={pending}
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
            type="submit">
            add
          </Button>
        </form>
      </Stack>
    </>
  );
}

export default LocationForm;

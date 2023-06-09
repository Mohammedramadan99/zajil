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
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import GoogleMaps from "./GoogleMaps";
import { useJsApiLoader } from "@react-google-maps/api";
import useBranch from "../../../hooks/useBranch";
// "399H+WWW, Al Warshah, Madinat Al-Amal, Nasr City, Cairo Governorate, Egypt"
function LocationForm() {
  const theme = useTheme();
  const [selectedAddress, setSelectedAddress] = useState("");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC8mNgASs0OW8OQW8VZd_R1QjIAIVz7YQg",
    // googleMapsApiKey: "AIzaSyDR-XNouBIpOk0K9t-HmlIM3KnCHifEHhY",
  });
  const { createBranch } = useBranch();
  const formik = useFormik({
    initialValues: {
      name: "",
      message: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("name is required").min(3),
      message: yup.string().required("message is required"),
    }),
    onSubmit: (values) => {
      const data = {
        ...values,
        // location: selectedAddress,
        location:
          "399H+WWW, Al Warshah, Madinat Al-Amal, Nasr City, Cairo Governorate, Egypt",
      };
      createBranch(data);
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
              value={selectedAddress}
              // required
            />
            {!isLoaded && <div>Loading...</div>}
            {isLoaded && (
              <GoogleMaps
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            )}
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

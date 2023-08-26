import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
// import useBranch from "../../../hooks/useBranch";

import { useDispatch, useSelector } from "react-redux";
import { createBranch, reset } from "../../../store/businessSlice";
import GoogleMaps from "./GoogleMaps";
import { useJsApiLoader } from "@react-google-maps/api";

function CreateBranchForm() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { businesses, branch } = useSelector((state) => state.businesses);

  const [success, setSuccess] = useState("");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const [selectedAddress, setSelectedAddress] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      business: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("name is required"),
      business: yup.string().required("business is required"),
    }),
    onSubmit(values,{resetForm}) {
      handleSubmit(values,resetForm);
    },
  });
  const handleSubmit = async (values,resetForm) => {
    const branchData = {
      businessId: values.business,
      address: selectedAddress,
      name: values.name,
    };
    dispatch(createBranch(branchData));
    resetForm()
  };
  useEffect(() => {
    branch && setSuccess(`${branch.data.name} branch created successfully`);
  }, [branch]);

  useEffect(() => {
    dispatch(reset());
  }, []);

  return (
    businesses?.length > 0 && (
      <Paper
        sx={{
          maxWidth: 700,
          m: "20px auto",
          backgroundColor: theme.palette.background.alt,
          p: "10px 40px 30px",
        }}>
        {success && (
          <Alert variant="outlined" severity="success">
            {" "}
            {success}{" "}
          </Alert>
        )}

        <Typography
          variant="h1"
          textTransform={"capitalize"}
          fontWeight={600}
          mb={4}
          mt={2}>
          create{" "}
          <span
            style={{
              display: "inline-block",
              color: theme.palette.primary[500],
            }}>
            branch
          </span>
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Stack
            direction="row"
            alignItems={"center"}
            spacing={2}
            sx={{ mb: 2 }}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.name)}
              helperText={formik.errors.name}
              sx={{ width: "100%" }}
            />
            <FormControl required sx={{ my: 2, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-required-label">
                Business
              </InputLabel>
              <Select
                name="business"
                label="Business"
                value={formik.values.business}
                error={Boolean(formik.errors.business)}
                onChange={formik.handleChange}>
                {businesses?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <TextField
            name="location"
            label="Location"
            value={selectedAddress}
            sx={{ width: "100%", mb: 2 }}
            // required
          />
          {!isLoaded && <div>Loading...</div>}
          {isLoaded && (
            <GoogleMaps
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          )}

          {/* <GoogleMaps w={"100%"} /> */}
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "100%", mt: 4 }}>
            Create
          </Button>
        </Box>
      </Paper>
    )
  );
}

export default memo(CreateBranchForm);

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useBusiness from "../../../hooks/useBusiness";
import { useFormik } from "formik";
import * as yup from "yup";
import useBranch from "../../../hooks/useBranch";
import GoogleMaps from "../Location/GoogleMaps";

function CreateBranchForm() {
  const theme = useTheme();
  const { getBusinesses, data: businesses } = useBusiness();
  const { createBranch, data } = useBranch();

  useEffect(() => {
    getBusinesses();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      business: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("name is required"),
      business: yup.string().required("business is required"),
    }),
    onSubmit(values) {
      const branchData = {
        businessId: values.business,
        address: "ain shams",
        name: values.name,
      };
      createBranch(branchData);
    },
  });
  return (
    businesses?.length > 0 && (
      <Box>
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
          <div>
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
          </div>
          <FormControl required sx={{ my: 2, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-required-label">
              Business
            </InputLabel>
            <Select
              name="business"
              label="Business"
              value={formik.values.business}
              error={Boolean(formik.errors.business)}
              helperText={formik.errors.business}
              onChange={formik.handleChange}>
              {businesses?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <GoogleMaps w={"100%"} />
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "100%", mt: 4 }}>
            Create
          </Button>
        </Box>
      </Box>
    )
  );
}

export default CreateBranchForm;

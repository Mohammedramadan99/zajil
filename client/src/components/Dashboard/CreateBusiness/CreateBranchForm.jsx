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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useBusiness from "../../../hooks/useBusiness";
import { useFormik } from "formik";
import * as yup from "yup";

function CreateBranchForm() {
  const { getBusinesses, data } = useBusiness();
  const [business, setBusiness] = useState();
  useEffect(() => {
    getBusinesses();
  }, []);
  console.log({ business });
  const handleChange = (event) => {
    setBusiness(event.target.value);
  };
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
      // createBranch(values);
    },
  });
  return (
    <>
      <Typography
        variant="h1"
        textTransform={"capitalize"}
        fontWeight={600}
        mb={4}
        mt={2}>
        create branch
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
        <FormControl required sx={{ m: 1, minWidth: 120 }}>
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
            {data?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ width: "100%", mt: 4 }}>
          Create
        </Button>
      </Box>
    </>
  );
}

export default CreateBranchForm;

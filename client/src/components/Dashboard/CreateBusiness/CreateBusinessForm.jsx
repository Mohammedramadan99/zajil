import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import useBusiness from "../../../hooks/useBusiness";
function CreateBusinessForm() {
  const { createBusiness } = useBusiness();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: yup.object({
      name: yup.string().required(),
    }),
    onSubmit(values) {
      createBusiness(values);
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
        create business
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <div>
          <TextField
            name="name"
            label="Name"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.name)}
            sx={{ width: "100%" }}
          />
        </div>
        <Button type="submit" variant="contained" sx={{ width: "100%", mt: 4 }}>
          Create
        </Button>
      </Box>
    </>
  );
}

export default CreateBusinessForm;

import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import useBusiness from "../../../hooks/useBusiness";
import { useNavigate } from "react-router-dom";
function CreateBusinessForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { createBusiness, pending, error } = useBusiness();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: yup.object({
      name: yup.string().required(),
    }),
    onSubmit(values) {
      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    const result = await createBusiness(values);
    if (result) {
      navigate("/admin/branch/new");
    }
  };
  return (
    <Box
      maxWidth={500}
      sx={{
        backgroundColor: theme.palette.grey[900],
        m: {
          xs: "30px auto",
          lg: "100px auto auto",
        },
      }}
      p={5}
      borderRadius={5}>
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
          business
        </span>
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        {error && (
          <Alert variant="filled" severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <div>
          <TextField
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.name)}
            helperText={formik.errors.name}
            sx={{ width: "100%" }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: "100%", mt: 4 }}
          disabled={pending}>
          Create
        </Button>
        <Typography
          variant="body1"
          sx={{ my: 2, color: theme.palette.grey[500] }}>
          {" "}
          <span style={{ fontWeight: 600, color: "#ccc" }}>Note:</span> Creating
          a business will make you able to create a branch, that means you
          cannot create a branch if you don't have a business.
        </Typography>
      </Box>
    </Box>
  );
}

export default CreateBusinessForm;

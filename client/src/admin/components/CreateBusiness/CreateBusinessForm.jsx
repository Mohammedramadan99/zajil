import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { createBusiness, resetBusiness } from "../../../store/businessSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import UniSelect from '../../components/common/UniSelect/UniSelect'
import { updateBusinesses } from "../../../store/authSlice";

function CreateBusinessForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    errorMessage: error,
    loading,
    business,
  } = useSelector((state) => state.businesses);
  const { user } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "CARD",
    },
    validationSchema: yup.object({
      name: yup.string().required(),
      type: yup.string().required().oneOf(["CARD", "EVENT"]), 
    }),
    onSubmit(values) {
      handleSubmit(values);
    },
  });
  const { setFieldValue, setValues, values, resetForm } = formik;

  const handleSubmit = (values) => {
    dispatch(createBusiness(values));
  };
  if (business) {
    navigate("/admin/branch/new");
  }
  if (business) {
    toast.success(`${business.name} created`);
    formik.resetForm()
    dispatch(updateBusinesses(business));
    dispatch(resetBusiness());
  }
  const items = [
    { value: "EVENT", text: "Event (Tickets)" },
    { value: "CARD", text: "Cards (Loyalty,Subscription,Coupon)" },
  ];
  return (
    <Paper
      sx={{
        maxWidth: 700,
        m: {
          xs: "30px auto",
          lg: "100px auto auto",
        },
        backgroundColor: theme.palette.background.alt,
        p: "10px 40px 30px",
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
            sx={{ width: "100%",mb:2 }}
          />
          <UniSelect
            name="Enter your Business Type"
            value={formik.values.status}
            items={items}
            selectTitle="status"
            handleChange={formik.handleChange}
            cstStyle={{ flex: 1 }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          sx={{ width: "100%", mt: 4 }}
          disabled={loading}>
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
    </Paper>
  );
}

export default CreateBusinessForm;

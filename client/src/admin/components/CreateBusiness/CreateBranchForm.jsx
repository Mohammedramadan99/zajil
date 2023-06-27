import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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
import { useDispatch, useSelector } from "react-redux";
import { getBusinesses } from "../../../store/businessSlice";

function CreateBranchForm() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { businesses } = useSelector((state) => state.businesses);
  const { createBranch, data } = useBranch();
  const [success, setSuccess] = useState("");
  useEffect(() => {
    dispatch(getBusinesses());
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
      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    const branchData = {
      businessId: values.business,
      address: "ain shams",
      name: values.name,
    };
    const result = await createBranch(branchData);
    result && setSuccess(`${values.name} branch created successfully`);
  };
  return (
    businesses?.length > 0 && (
      <Box
        sx={{
          maxWidth: 700,
          // width: "100%",
          m: "50px auto",
          backgroundColor: theme.palette.grey[900],
          p: 5,
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
          <Stack direction="row" alignItems={"center"} spacing={2}>
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
                helperText={formik.errors.business}
                onChange={formik.handleChange}>
                {businesses?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* <GoogleMaps w={"100%"} /> */}
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

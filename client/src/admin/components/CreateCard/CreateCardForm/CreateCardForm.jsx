import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createCard, reset } from "../../../../store/CardSlice";
import { useDispatch, useSelector } from "react-redux";

function CreateCardForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { templateId, businessId } = useParams();
  const { error, loading, card } = useSelector((state) => state.cards);

  const formik = useFormik({
    initialValues: {
      clientName: "",
      clientPhone: "",
    },
    validationSchema: yup.object({
      clientName: yup.string().required("Client Name is required"),
      clientPhone: yup.string().required("Client Phone  is required"),
    }),
    onSubmit(values) {
      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    const templateIdNumber = +templateId;
    dispatch(
      createCard({
        data: { ...values, templateId: templateIdNumber },
        params: { businessId },
      })
    );
  };

  useEffect(() => {
    if (card) {
      dispatch(reset());
    }
  }, []);
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
      {!card ? (
        <>
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
              card
            </span>
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit}>
            {error && (
              <Alert variant="filled" severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                name="clientName"
                label="Client Name"
                value={formik.values.clientName}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.clientName)}
                helperText={formik.errors.clientName}
                sx={{ width: "100%" }}
              />
              <TextField
                name="clientPhone"
                label="Client Phone"
                value={formik.values.clientPhone}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.clientPhone)}
                helperText={formik.errors.clientPhone}
                sx={{ width: "100%" }}
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "100%", mt: 4 }}
              disabled={loading}>
              Create
            </Button>
          </Box>
        </>
      ) : (
        <Stack direction={"row"} spacing={2} justifyContent={"center"}>
          {/* <Button variant="contained" onClick={() => downloadCard()}>
            download the card
          </Button> */}
          <Button variant="contained">
            <Link
              className="flex"
              to={card.s3Location}
              target="_blank"
              download>
              Download the card
            </Link>
          </Button>

          <Button variant="contained">
            <Link to="/admin/cards">cards</Link>
          </Button>
        </Stack>
      )}
      <Typography
        variant="body1"
        sx={{ my: 2, color: theme.palette.grey[500] }}>
        {" "}
        {/* <span style={{ fontWeight: 600, color: "#ccc" }}>Note:</span> Creating
          a business will make you able to create a branch, that means you
          cannot create a branch if you don't have a business. */}
      </Typography>
    </Box>
  );
}

export default CreateCardForm;

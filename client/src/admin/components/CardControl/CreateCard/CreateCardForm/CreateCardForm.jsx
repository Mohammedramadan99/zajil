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
import BasicSelect from "../../GlobalComponents/BasicSelect";
import { toast } from "react-toastify";
function CreateCardForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { templateId, businessId } = useParams();
  const { loading, errors, errorMessage, card, cardCreated } = useSelector(
    (state) => state.cards
  );

  const formik = useFormik({
    initialValues: {
      clientName: "",
      clientPhone: "",
      gender: "",
    },
    validationSchema: yup.object({
      clientName: yup.string(),
      clientPhone: yup.string(),
      gender: yup.string().required("gender is required"),
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
  if (errorMessage) {
    toast.error(errorMessage);
    dispatch(reset());
  }
  if (errors) {
    {
      errors.map((error) => {
        return Object.keys(error).map((key) => {
          return error[key].map((errorMsg, index) => {
            toast.error(`${errorMsg}`);
          });
        });
      });
    }
  }
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
      {!cardCreated ? (
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
              <BasicSelect
                options={["male", "female"]}
                value={formik.values.gender}
                onChange={formik.handleChange}
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
          <Link
            className="flex"
            to={`https://walletpass.io?u=${card.s3Location}`}
            target="_blank"
            download>
            <img
              src={
                "https://www.walletpasses.io/badges/badge_web_generic_en@2x.png"
              }
              alt="wallet_img"
            />
          </Link>
        </Stack>
      )}
    </Box>
  );
}

export default CreateCardForm;

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
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
import { useSearchParams } from "react-router-dom";

function CreateCardForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { templateId, businessId } = useParams();
  const { loading, errors, errorMessage, card, cardCreated } = useSelector(
    (state) => state.cards
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");
  const formik = useFormik({
    initialValues: {
      clientName: "",
      clientPhone: "",
      gender: "",
      // Coupon
      discountValue: 0,
      discountType: "",
      maxUsage: 0,
    },
    validationSchema: yup.object({
      clientName: yup.string().required("Client name shouldn't be empty"),
      clientPhone: yup.string().required("Client phone shouldn't be empty"),
      gender: yup.string().required("Gender is required"),
      discountValue: type
        ? yup
            .number()
            .min(1, "Discount Value shouldn't be empty")
            .required("Discount Value shouldn't be empty")
        : yup.number(),
      discountType: type
        ? yup
            .string()
            .oneOf(
              ["percentage", "fixed_amount"],
              "Choose one of these 'percentage', 'fixed_amount'"
            )
            .required("Discount Type is required")
        : yup.string(),
      maxUsage: type
        ? yup
            .number()
            .min(1, "Max Usage is required")
            .required("Max Usage is required")
        : yup.number(),
    }),
    onSubmit(values) {
      handleSubmit(values);
    },
  });
  const handleSubmit = async (values) => {
    const {
      clientName,
      clientPhone,
      gender,
      discountValue,
      discountType,
      maxUsage,
    } = values;
    const templateIdNumber = +templateId;
    const requestData = {
      data: { templateId: templateIdNumber, clientName, clientPhone, gender },
      params: { businessId },
    };
    console.log({ type });
    if (type) {
      requestData.data = {
        ...requestData.data,
        discountValue,
        discountType,
        maxUsage,
      };
    }

    dispatch(createCard(requestData));
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
    <Paper
      sx={{
        maxWidth: 700,
        m: "20px auto",
        backgroundColor: theme.palette.background.alt,
        p: "10px 40px 30px",
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
                name="gender"
                label="Gender"
                options={["male", "female"]}
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.gender)}
                helperText={formik.errors.gender}
              />
              {type === "coupon" && (
                <>
                  <Stack direction={"row"} spacing={2}>
                    {/* <TextField
                      name="discountType"
                      label="Discount Type"
                      value={formik.values.discountType}
                      onChange={formik.handleChange}
                      sx={{ width: "100%" }}
                    /> */}
                    <BasicSelect
                      name="discountType"
                      label="Discount Type"
                      options={["percentage", "fixed_amount"]}
                      value={formik.values.discountType}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.discountType)}
                      helperText={formik.errors.discountType}
                    />
                    <TextField
                      type="number"
                      name="discountValue"
                      label="Discount Value"
                      value={formik.values.discountValue}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.discountValue)}
                      helperText={
                        formik.touched.discountValue &&
                        formik.errors.discountValue
                      }
                      sx={{ width: "100%" }}
                    />
                    <TextField
                      type="number"
                      name="maxUsage"
                      label="Max Usage"
                      value={formik.values.maxUsage}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.maxUsage)}
                      helperText={formik.errors.maxUsage}
                      sx={{ width: "100%" }}
                    />
                  </Stack>
                </>
              )}
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
            to={`https://walletpass.io?u=${card?.s3Location}`}
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
    </Paper>
  );
}

export default CreateCardForm;

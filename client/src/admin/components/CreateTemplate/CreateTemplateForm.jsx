import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { AddAPhoto } from "@mui/icons-material";
import * as yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-toastify";
import ScanIcon1 from "../../../assets/images/stickers/barcode_icon-1.png";
import ScanIcon2 from "../../../assets/images/stickers/qrCode_icon-1.png";
import barcodeimg from "../../../assets/images/barcode-1.png";
import qrcode from "../../../assets/images/qrcode.png";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import html2canvas from "html2canvas";
import TabPanel from "./LoyaltyTabs";
import {
  createTemplate,
  reset,
  setCardType,
  setCouponCardsTemplate,
  setNormalCardsTemplate,
  setSharedProps,
} from "../../../store/templateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateTemplateForm({
  tempPhoto,
  setTempPhoto,
  activeImg,
  setActiveImg,
  logoImg,
  setLogoImg,
  textLogo,
  setTextLogo,
  stickersNumber,
  setStickersNumber,
  activeIcon,
  setActiveIcon,
  name,
  setName,
  activeScanType,
  setActiveScanType,
  imgColor,
  setImgColor,
  barcode,
  setBarcode,
  labelColor,
  setLabelColor,
  backgroundColor,
  setBackgroundColor,
  headerFieldValue,
  setHeaderFieldValue,
  headerFieldLabel,
  setHeaderFieldLabel,
  textColor,
  setTextColor,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { template, couponCardsTemplate, errors, loading } = useSelector(
    (state) => state.templates
  );
  const {
    name: couponname,
    cardType: couponcardType,
    startDate: couponstartDate,
    endDate: couponendDate,
    occasionName: couponoccasionName,
    logoUrl: couponlogoUrl,
    iconUrl: couponiconUrl,
    stripUrl: couponstripUrl,
    logoText: couponlogoText,
    designType: coupondesignType,
    backgroundColor: couponbackgroundColor,
    foregroundColor: couponforegroundColor,
    labelColor: couponlabelColor,
    headerFields: couponheaderFields,
    secondaryFields: couponsecondaryFields,
  } = couponCardsTemplate;

  const { cardType } = useSelector((state) => state.templates);
  const { businesses } = useSelector((state) => state.businesses);
  const { user } = useSelector((state) => state.auth);
  const [color, setColor] = useState("#aabbcc");
  const [activeStickers, setActiveStickers] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [stripUrl, setStripUrl] = useState(null);
  const [newStrip, setNewStrip] = useState(null);
  const [uploadStickerLoading, setUploadStickerLoading] = useState(false);
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      cardName: "",
      cardType: "",
      brandName: "",
      stickersNumber,
      name,
      business: "",
      giftName: "",
      giftPriceNPoints: 0,
      headerFieldLabel: "",
      headerFieldValue: "",
      couponOccasionName: "",
      couponStartDate: "",
      couponEndDate: "",
    },
    validationSchema: yup.object({
      cardName: yup.string().required("cardName is required"),
      cardType: yup.string().required("cardType is required"),
      brandName: yup.string().required("brandName is required"),
      nItems: yup.number(),
      name: yup.string(),
      stickersNumber: yup.number().min(1).max(30),
      earnedRewards: yup.number(),
      nextGift: yup.number(),
      giftName: yup.string(),
      giftPriceNPoints: yup.number(),
      headerFieldLabel: yup.string(),
      headerFieldValue: yup.string(),
    }),
    onSubmit(values) {
      (async () => {
        let imgs = [];
        if (imgColor) {
          const canvas = await html2canvas(imgColor, {
            useCORS: true,
            x: 0,
            y: 0,
          });
          const imgData = canvas.toDataURL("image/png");
          const byteCharacters = atob(imgData.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/png" });
          const file = new File([blob], "filename.png", {
            type: "image/png",
            lastModified: new Date().getTime(),
          });
          imgs = [tempPhoto, file];
        } else {
          imgs = [tempPhoto];
        }
        // upload imgs
        const uploadPromises = imgs?.map(async (img) => {
          const form = new FormData();
          form.append("file", img);

          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/file-upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              body: form,
            }
          );
          const imgUrl = await res.json();
          console.log({ imgUrl });
          if (img.name === "logoUrl") {
            setLogoUrl(imgUrl.data.url);
          } else if (img.name === "stripUrl") {
            setStripUrl(imgUrl.data.url);
          }
          return imgUrl.data.url;
        });
        const uploadedImgUrls = await Promise.all(uploadPromises);
        const cardData = {
          params: { businessId: values.business },
          data: {
            ...values,
            name: formik.values.cardName,
            logoUrl: uploadedImgUrls[0],
            logoText: values.brandName,
            nItems: stickersNumber,
            stickersCount: stickersNumber,
            stickers: activeStickers,
            priceNPoints: values.giftPriceNPoints,
            pointsPerVisit: 10,
            gifts: [
              {
                name: values.giftName,
                priceNPoints: values.giftPriceNPoints,
              },
            ],
            designType: "storeCard",
            iconUrl: uploadedImgUrls[0] || "",
            stripUrl: uploadedImgUrls[1] || activeImg.url,
            qrCodeFormat: barcode,
            cardProps: {
              backgroundColor: hexToRgb(backgroundColor || "#ffffff"),
              labelColor: hexToRgb(labelColor),
              foregroundColor: hexToRgb(textColor),
              headerFields: [
                {
                  key: `${Math.floor(Math.random() * 100000000) + 1}`,
                  label: values.headerFieldLabel,
                  value: values.headerFieldValue,
                },
              ],
              secondaryFields: [
                {
                  key: `${Math.floor(Math.random() * 100000000) + 1}`,
                  label: "name",
                  value: "{{clientName}}",
                },
              ],
              auxiliaryFields: [
                {
                  key: `${Math.floor(Math.random() * 100000000) + 1}`,
                  label: "",
                  value: "",
                },
              ],
            },
          },
        };
        dispatch(createTemplate(cardData));
      })();
    },
  });
  const bgs = [
    {
      id: 1,
      url: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/strip+background/bg-1.jpg",
    },
    {
      id: 2,
      url: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/strip+background/bg-2.jpg",
    },
    {
      id: 3,
      url: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/strip+background/bg-3.jpg",
    },
    {
      id: 4,
      url: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/strip+background/bg-4.jpg",
    },
    {
      id: 5,
      url: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/strip+background/bg-5.jpg",
    },
  ];

  const cardTypes = [
    { text: "Loyalty", type: "LOYALTY", store: "normal" },
    {
      text: "Subscription",
      type: "ITEMS_SUBSCRIPTION",
      store: "ITEMS_SUBSCRIPTION",
    },
    { text: "Coupon", type: "COUPON", store: "coupon" },
  ];

  const [stickersIcons, setStickersIcons] = useState([
    {
      id: 1,
      icon: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/Stickers/meat.png",
    },
    {
      id: 2,
      icon: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/Stickers/fish.png",
    },
    {
      id: 3,
      icon: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/Stickers/chicken.png",
    },
    {
      id: 4,
      icon: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/Stickers/sweet-1.png",
    },
    {
      id: 5,
      icon: "https://zajil-bucket.s3.me-south-1.amazonaws.com/uploads/Stickers/sweet-2.png",
    },
  ]);

  const scanTypes = [
    {
      icon: ScanIcon1,
      type: "PKBarcodeFormatCode128",
      // type: "PKBarcodeFormatAztec", // qr
      // type: "PKBarcodeFormatPDF417", // bar
      url: barcodeimg,
    },
    {
      icon: ScanIcon2,
      type: "PKBarcodeFormatQR",
      url: qrcode,
    },
  ];

  const cardBgHandler = (bg) => {
    setActiveImg(bg);
    dispatch(setSharedProps({ propName: "stripUrl", propValue: bg }));
  };

  const onImageChange = (e) => {
    console.log(e.target.files);
    if (e.target.files.length <= 0) {
      return false;
    }
    const file = e.target.files[0];
    const validExtension = new RegExp("^image/(jpeg|png|jpg)$", "ig").test(
      file.type
    );
    const validSize = file.size <= 512 * 1024;
    if (!validSize) {
      toast.error("The image size should be less than 512KB.");
      return false;
    } else if (!validExtension) {
      toast.error(
        "The image format is not supported. Please upload a JPEG, PNG, or JPG file."
      );
      return false;
    }
    const url = URL.createObjectURL(file);
    dispatch(
      setNormalCardsTemplate({
        propName: "logoImg",
        propValue: url,
      })
    );
    dispatch(
      setNormalCardsTemplate({
        propName: "tempPhoto",
        propValue: file,
      })
    );
    // setLogoImg(url);
    // setTempPhoto(file);
  };

  const onStickerIconChange = async (e) => {
    if (e.target.files.length <= 0) {
      return false;
    }
    const file = e.target.files[0];
    const validExtension = new RegExp("^image/(jpeg|png|jpg)$", "ig").test(
      file.type
    );
    const validSize = file.size <= 512 * 1024;
    if (!validExtension || !validSize) {
      return false;
    }
    const form = new FormData();
    form.append("file", file);
    setUploadStickerLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/file-upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: form,
    });
    const imgUrl = await res.json();

    const newStickersIcons = [
      ...stickersIcons,
      { id: Math.floor(Math.random() * 1000) + 1, icon: imgUrl?.data?.url },
    ];
    setUploadStickerLoading(false);

    setStickersIcons(newStickersIcons);
  };

  useEffect(() => {
    if (textLogo) {
      setTextLogo(textLogo);
    } else if (logoImg) {
      setLogoImg(logoImg);
    }
    if (stickersNumber) {
      setStickersNumber(stickersNumber);
    }
  }, [stickersNumber, textLogo, logoImg]);

  const fileInputClick = (event) => {
    event.target.value = null;
  };

  const addStickerHandler = (item) => {
    if (formik.values.cardType === "LOYALTY") {
      if (activeStickers.length >= 1) {
        const stickerIndex = activeStickers.findIndex(
          (sticker) => sticker.id === item.id
        );

        if (stickerIndex !== -1) {
          setActiveStickers(
            activeStickers.filter((sticker, index) => index !== stickerIndex)
          );
        } else {
          return false;
        }
      } else {
        const stickerIndex = activeStickers.findIndex(
          (sticker) => sticker.id === item.id
        );

        if (stickerIndex !== -1) {
          setActiveStickers(
            activeStickers.filter((sticker, index) => index !== stickerIndex)
          );
        } else {
          setActiveStickers(
            activeStickers.concat({
              id: item.id,
              imageUrl: item.icon,
              title: "test",
              imageType: "png",
            })
          );
        }
      }
    } else {
      const stickerIndex = activeStickers.findIndex(
        (sticker) => sticker.id === item.id
      );

      if (stickerIndex !== -1) {
        setActiveStickers(
          activeStickers.filter((sticker, index) => index !== stickerIndex)
        );
      } else {
        setActiveStickers(
          activeStickers.concat({
            id: item.id,
            imageUrl: item.icon,
            title: "test",
            imageType: "png",
          })
        );
      }
    }
  };

  useEffect(() => {
    if (template) {
      dispatch(reset());

      navigate("/admin/templates");
    }
  }, [template]);

  // Convert the color to an image
  const hexToRgb = (hex) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        {errors && (
          <Alert severity="error" sx={{ marginBottom: 4 }}>
            {errors?.map((error) => {
              return Object.keys(error)?.map((key) => {
                const value = error[key];
                if (Array.isArray(value)) {
                  return value.map((errorMsg, index) => (
                    <div className="error" key={`${key}-${index}`}>
                      <strong>{key}:</strong> {errorMsg}
                    </div>
                  ));
                } else {
                  return null;
                }
              });
            })}
          </Alert>
        )}

        {/* ############ Accordion 1 : Main info ############ */}
        <Accordion
          defaultExpanded
          sx={{ background: theme.palette.background.alt }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Typography> Main Info </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              marginBottom={2}>
              {/* Card Name */}
              <TextField
                name="cardName"
                label="Card Name"
                value={formik.values.cardName}
                onChange={(e) => {
                  dispatch(
                    setCouponCardsTemplate({
                      propName: "cardName",
                      propValue: e.target.value,
                    })
                  );
                  formik.handleChange(e);
                }}
                error={Boolean(formik.errors.cardName)}
                helperText={formik.errors.cardName}
                sx={{
                  width: "100%",
                }}
              />
              {/* Business ID */}
              <FormControl required sx={{ my: 2, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-required-label">
                  Business
                </InputLabel>
                <Select
                  name="business"
                  label="Business"
                  value={formik.values.business}
                  error={Boolean(formik.errors.business)}
                  required
                  onChange={formik.handleChange}>
                  {businesses?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Card Type */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Card Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  required
                  name="cardType"
                  value={formik.values.cardType}
                  label="Card Type"
                  onChange={(e) => {
                    dispatch(setCardType(e.target.value));
                    formik.handleChange(e);
                  }}
                  error={Boolean(formik.errors.cardType)}>
                  {cardTypes.map((item, i) => (
                    <MenuItem
                      key={i}
                      value={item.store}
                      onClick={() => {
                        if (activeStickers.length > 2) {
                          setActiveStickers([]);
                        }
                      }}>
                      {item.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Special Components for each card type */}
              {formik.values.cardType === "ITEMS_SUBSCRIPTION" && (
                <>
                  <Stack direction={"row"} spacing={2}>
                    <TextField
                      name="itemsNumber"
                      label="Items Number"
                      type="number"
                      required
                      value={formik.values.nItems}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.nItems)}
                      helperText={formik.errors.nItems}
                      sx={{
                        width: "50%",
                      }}
                    />
                    <TextField
                      name="maxDailyUsage"
                      label="Max Daily Usage"
                      type="number"
                      required
                      value={formik.values.maxDailyUsage}
                      onChange={formik.handleChange}
                      error={Boolean(formik.errors.maxDailyUsage)}
                      helperText={formik.errors.maxDailyUsage}
                      sx={{
                        width: "50%",
                      }}
                    />
                  </Stack>
                  <TextField
                    name="subscriptionDurationDays"
                    label="subscription Duration Days"
                    type="number"
                    required
                    value={formik.values.subscriptionDurationDays}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.subscriptionDurationDays)}
                    helperText={formik.errors.subscriptionDurationDays}
                    sx={{
                      width: "100%",
                    }}
                  />
                </>
              )}
              {formik.values.cardType === "normal" && (
                <Stack direction={"row"} spacing={2} width={"100%"}>
                  <TextField
                    name="giftName"
                    label="Gift"
                    required
                    value={formik.values.giftName}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.giftName)}
                    helperText={formik.errors.giftName}
                    sx={{
                      width: "100%",
                    }}
                  />
                  <TextField
                    name="giftPriceNPoints"
                    label="Points"
                    type="number"
                    required
                    value={formik.values.giftPriceNPoints}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.giftPriceNPoints)}
                    helperText={formik.errors.giftPriceNPoints}
                    sx={{
                      width: "100%",
                    }}
                  />
                </Stack>
              )}
              {formik.values.cardType === "coupon" && (
                <Stack direction={"row"} spacing={2} width={"100%"}>
                  <TextField
                    name="couponOccasionName"
                    label="Occasion Name"
                    required
                    value={formik.values.couponOccasionName}
                    onChange={(e) => {
                      setCouponCardsTemplate({
                        propName: "occasionName",
                        propValue: e.target.value,
                      });
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.couponOccasionName)}
                    helperText={formik.errors.couponOccasionName}
                    sx={{
                      width: "100%",
                    }}
                  />
                  {/* Replace it with datepicker of MUI */}
                  <TextField
                    name="couponStartDate"
                    label="Start Date"
                    type="text"
                    required
                    value={formik.values.couponStartDate}
                    onChange={(e) => {
                      setCouponCardsTemplate({
                        propName: "startDate",
                        propValue: e.target.value,
                      });
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.couponStartDate)}
                    helperText={formik.errors.couponStartDate}
                    sx={{
                      width: "100%",
                    }}
                  />
                  {/* Replace it with datepicker of MUI */}
                  <TextField
                    name="couponEndDate"
                    label="End Date"
                    type="text"
                    required
                    value={formik.values.couponEndDate}
                    onChange={(e) => {
                      setCouponCardsTemplate({
                        propName: "endDate",
                        propValue: e.target.value,
                      });
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.couponEndDate)}
                    helperText={formik.errors.couponEndDate}
                    sx={{
                      width: "100%",
                    }}
                  />
                </Stack>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ############ Accordion 2 : Strip area(bgs) ############ */}
        <Accordion
          defaultExpanded
          sx={{ background: theme.palette.background.alt }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header">
            <Typography>Select Background</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="h4"
              mb={2}
              textTransform={"capitalize"}
              textAlign={"center"}>
              easily add your own personal touch!
            </Typography>
            <div className="bgs">
              {bgs.map(({ id, url }) => (
                <box
                  key={id}
                  flexBasis={"unset !important"}
                  maxWidth={"100%"}
                  className={`card-bg ${
                    activeImg.url === url ? "active" : ""
                  }`}>
                  <img
                    src={url}
                    width={"100%"}
                    height={170}
                    alt="card img"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="overlay">
                    <div className="icon">
                      <AddCircleOutlinedIcon
                        onClick={() => cardBgHandler({ url })}
                        sx={{
                          color: theme.palette.primary[600],
                        }}
                      />
                    </div>
                  </div>
                </box>
              ))}
              <div
                className={`card-bg ${
                  activeImg.color === color ? "active" : ""
                }`}
                style={{ background: color }}>
                <div className="overlay">
                  <div className="icon">
                    <AddCircleOutlinedIcon
                      onClick={() => cardBgHandler({ color })}
                      sx={{
                        color: theme.palette.primary[600],
                      }}
                    />
                  </div>
                </div>
              </div>
              <HexColorPicker
                color={color}
                onChange={(newColor) => {
                  setColor(newColor);
                  cardBgHandler({ color: newColor });
                }}
                style={{
                  width: "100%",
                  height: "170px",
                }}
              />
            </div>
          </AccordionDetails>
        </Accordion>

        {/* ############ Accordion 3 : Design ############ */}
        <Accordion
          defaultExpanded
          sx={{ background: theme.palette.background.alt }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Typography> Design </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              marginBottom={2}>
              <div className="flex-column">
                <div className="flex">
                  <Typography variant="body1" color={theme.palette.grey[500]}>
                    Select a logo
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      position: "relative",
                      width: "50px",
                    }}>
                    <img src={textLogo && ""} id="logo" width={50} />

                    <label
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "20%",
                        transform: "translate(-50%,-50%)",
                        color: "#dfdfdf",
                        cursor: "pointer",
                      }}>
                      <AddAPhotoIcon fontSize="medium" />
                      <input
                        type="file"
                        // multiple={false}
                        accept="image/jpeg,image/jpg,image/png"
                        style={{ display: "none" }}
                        onClick={fileInputClick}
                        onChange={onImageChange}
                      />
                    </label>
                  </div>
                </div>
                {/* Start Features For Normal Cards */}
                {cardType !== "coupon" && (
                  <>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      mt={2}>
                      <TextField
                        name="brandName"
                        label="Brand Name"
                        value={textLogo}
                        onChange={(e) => {
                          setTextLogo(e.target.value);
                          dispatch(
                            setNormalCardsTemplate({
                              propName: "textLogo",
                              propValue: e.target.value,
                            })
                          );
                        }}
                        onBlur={formik.handleChange}
                        error={Boolean(formik.errors.brandName)}
                        helperText={formik.errors.brandName}
                        sx={{
                          width: "100%",
                          "& .MuiOutlinedInput-root": {
                            // outlineColor: "transparent",
                          },
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              // borderColor: "#7b2cbfff !important",
                            },
                          "& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused":
                            {
                              // color: "#7b2cbfff",
                            },
                        }}
                      />
                      <TextField
                        name="stickersNumber"
                        label="Stickers Number"
                        type="number"
                        value={formik.values.stickersNumber}
                        onChange={(e) => {
                          setStickersNumber(Number(e.target.value));
                          formik.setFieldValue(
                            "stickersNumber",
                            Number(e.target.value)
                          );
                        }}
                        error={Boolean(formik.errors.stickersNumber)}
                        helperText={formik.errors.stickersNumber}
                        inputProps={{
                          min: 1,
                          max: 30,
                        }}
                        sx={{
                          width: "100%",
                          xs: { width: "100%" },
                          sm: { width: "50%" },
                        }}
                      />
                    </Stack>
                    <Stack direction={{ xs: "column", sm: "row" }}>
                      <Box>
                        <div
                          style={{
                            color: "#999",
                            marginBlock: "10px",
                            display: "flex",
                            gap: "10px",
                          }}>
                          Stickers
                          {activeStickers.length > 0 && (
                            <span
                              style={{
                                color: "#0ddc0d",
                                background: "#0ddc0d3b",
                                borderRadius: "10px",
                                padding: "2px 10px",
                                fontSize: "12px",
                              }}>
                              selected {activeStickers.length}{" "}
                            </span>
                          )}
                        </div>
                        <div className="stickers-icons">
                          {stickersIcons.map((item) => {
                            const isActive = activeStickers.some(
                              (sticker) => sticker.id === item.id
                            );
                            return (
                              <div
                                className={isActive ? "icon active" : "icon"}
                                onClick={() => addStickerHandler(item)}
                                key={item.id}>
                                {uploadStickerLoading ? (
                                  <CircularProgress />
                                ) : (
                                  <img src={item.icon} alt="" width={30} />
                                )}
                              </div>
                            );
                          })}
                          <label
                            className="icon"
                            // onClick={() => addStickerHandler(item)}
                          >
                            {/* <input type="file" onChange={onStickerIconChange} /> */}
                            <AddAPhoto fontSize="medium" />
                            <input
                              type="file"
                              multiple={false}
                              accept="image/jpeg,image/jpg,image/png"
                              style={{ display: "none" }}
                              onChange={onStickerIconChange}
                            />
                          </label>
                        </div>
                      </Box>
                    </Stack>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      mt={2}>
                      <TextField
                        name="headerFieldLabel"
                        label="Header"
                        value={headerFieldLabel}
                        onChange={(e) => {
                          setHeaderFieldLabel(e.target.value);
                          formik.setFieldValue(
                            "headerFieldLabel",
                            e.target.value
                          );
                        }}
                        error={Boolean(formik.errors.headerFieldLabel)}
                        helperText={formik.errors.headerFieldLabel}
                        inputProps={{
                          min: 1,
                          max: 30,
                        }}
                        sx={{
                          width: "100%",
                          xs: { width: "100%" },
                          sm: { width: "50%" },
                        }}
                      />
                      <TextField
                        name="headerFieldValue"
                        label="Value"
                        type="text"
                        value={headerFieldValue}
                        onChange={(e) => {
                          setHeaderFieldValue(e.target.value);
                          formik.setFieldValue(
                            "headerFieldValue",
                            e.target.value
                          );
                        }}
                        error={Boolean(formik.errors.headerFieldValue)}
                        helperText={formik.errors.headerFieldValue}
                        inputProps={{
                          min: 1,
                          max: 30,
                        }}
                        sx={{
                          width: "100%",
                          xs: { width: "100%" },
                          sm: { width: "50%" },
                        }}
                      />
                    </Stack>
                  </>
                )}
                {/* End Features For Normal Cards */}
                <Stack>
                  <div
                    style={{
                      color: "#999",
                      marginBlock: "10px",
                    }}>
                    {" "}
                    Scan by {/*  type? , or just scan ? */}
                  </div>
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    {scanTypes.map((item, i) => (
                      <div
                        key={i}
                        className="flex"
                        style={{
                          background: "#fff",
                          padding: "10px",
                          transition: ".3s ease",
                          border: `2px solid ${
                            activeScanType.type === item.type
                              ? "#0ddc0d"
                              : "transparent"
                          }`,
                        }}
                        onClick={() => {
                          setActiveScanType(item);
                          setBarcode(item.type);
                          dispatch(
                            setSharedProps({
                              propName: "barcode",
                              propValue: item,
                            })
                          );
                          dispatch(
                            setSharedProps({
                              propName: "activeScanType",
                              propValue: item,
                            })
                          );
                        }}>
                        <img
                          src={item.icon}
                          alt="scan-icon"
                          width={item.type === "barCode" ? 60 : 30}
                          height={30}
                        />
                      </div>
                    ))}
                  </Box>
                </Stack>
              </div>
            </Box>
          </AccordionDetails>
        </Accordion>
        {/* ############ Accordion 4 : Colors ############ */}
        <Accordion
          defaultExpanded
          sx={{ background: theme.palette.background.alt }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header">
            <Typography>Choose Your Colors</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={"row"} spacing={2} mt={5}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h4" mb={2} fontWeight={600}>
                    {" "}
                    Label Color{" "}
                  </Typography>
                  <HexColorPicker
                    color={labelColor}
                    onChange={(newColor) => {
                      setLabelColor(newColor);
                      dispatch(
                        setSharedProps({
                          propName: "labelColor",
                          propValue: newColor,
                        })
                      );
                    }}
                    style={{
                      // maxWidth: "250px",
                      width: "100%",
                      height: "170px",
                      // marginLeft: "15px",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h4" mb={2} fontWeight={600}>
                    {" "}
                    Background Color{" "}
                  </Typography>
                  <HexColorPicker
                    color={backgroundColor}
                    onChange={(newColor) => {
                      setBackgroundColor(newColor);
                      dispatch(
                        setSharedProps({
                          propName: "backgroundColor",
                          propValue: newColor,
                        })
                      );
                    }}
                    style={{
                      // maxWidth: "250px",
                      width: "100%",
                      height: "170px",
                      // marginLeft: "15px",
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="h4" mb={2} fontWeight={600}>
                    {" "}
                    Text Color{" "}
                  </Typography>
                  <HexColorPicker
                    color={textColor}
                    onChange={(newColor) => {
                      setTextColor(newColor);
                      dispatch(
                        setSharedProps({
                          propName: "textColor",
                          propValue: newColor,
                        })
                      );
                    }}
                    style={{
                      // maxWidth: "250px",
                      width: "100%",
                      height: "170px",
                      // marginLeft: "15px",
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={loading}>
          submit
        </Button>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </form>
    </Box>
  );
}

export default CreateTemplateForm;

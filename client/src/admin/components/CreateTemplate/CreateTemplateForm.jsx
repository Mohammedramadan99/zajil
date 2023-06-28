import {
  Alert,
  Box,
  Button,
  FormControl,
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
import * as yup from "yup";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HexColorPicker } from "react-colorful";

import ScanIcon1 from "../../../assets/images/stickers/barcode_icon-1.png";
import ScanIcon2 from "../../../assets/images/stickers/qrCode_icon-1.png";
import barcode from "../../../assets/images/barcode-1.png";
import qrcode from "../../../assets/images/qrcode.png";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import html2canvas from "html2canvas";
import TabPanel from "./LoyaltyTabs";
import { createTemplate, reset } from "../../../store/TemplateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBusinesses } from "../../../store/businessSlice";

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
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { template, errors, loading } = useSelector((state) => state.templates);
  const { businesses } = useSelector((state) => state.businesses);
  const { user } = useSelector((state) => state.auth);
  const [color, setColor] = useState("#aabbcc");
  const [activeStickers, setActiveStickers] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [stripUrl, setStripUrl] = useState(null);
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      cardName: "",
      cardType: "",
      brandName: "",
      stickersNumber,
      name,
      giftName: "",
      giftPriceNPoints: "",
      business: "",
    },
    validationSchema: yup.object({
      cardName: yup.string().required(),
      cardType: yup.string().required(),
      brandName: yup.string().required(),
      nItems: yup.number(),
      name: yup.string().required(),
      stickersNumber: yup.number().required(),
      earnedRewards: yup.number(),
      nextGift: yup.number(),
      giftName: yup.string(),
      giftPriceNPoints: yup.number(),
    }),
    onSubmit(values) {
      (async () => {
        console.log({ imgColor, activeImg });
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

          const res = await fetch("http://localhost:3000/file-upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: form,
          });
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

        // const { id, ...stickersIcons } = activeStickers;

        // console.log({ stickers });
        const cardData = {
          params: { businessId: values.business },
          data: {
            ...values,
            logoUrl: uploadedImgUrls[0],
            logoText: values.brandName,
            nItems: stickersNumber,
            stickersCount: stickersIcons?.length,
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
            cardProps: {
              backgroundColor: "rgb(255,255,255)",
              foregroundColor: "rgb(0,0,0)",
              labelColor: "rgb(255,255,255)",
              headerFields: [
                {
                  key: "header",
                  label: "ORG",
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
    { text: "Loyalty", type: "LOYALTY" },
    { text: "Subscription", type: "ITEMS_SUBSCRIPTION" },
  ];

  const stickersIcons = [
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
  ];
  const scanTypes = [
    {
      icon: ScanIcon1,
      type: "barCode",
      url: barcode,
    },
    {
      icon: ScanIcon2,
      type: "qrCode",
      url: qrcode,
    },
  ];
  const cardBgHandler = (bg) => {
    setActiveImg(bg);
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
    if (!validExtension || !validSize) {
      return false;
    }
    const url = URL.createObjectURL(file);
    console.log({ url });
    setTextLogo(null);
    setLogoImg(url);
    setTempPhoto(file);
  };
  useEffect(() => {
    if (textLogo) {
      setLogoImg(null);
      setTextLogo(textLogo);
    } else if (logoImg) {
      setTextLogo(null);
      setLogoImg(logoImg);
    }
    if (stickersNumber) {
      setStickersNumber(stickersNumber);
    }
  }, [textLogo, logoImg, stickersNumber]);
  const fileInputClick = (event) => {
    event.target.value = null;
  };
  const addStickerHandler = (item) => {
    if (formik.values.cardType === "LOYALTY") {
      if (activeStickers.length >= 2) {
        const stickerIndex = activeStickers.findIndex(
          (sticker) => sticker.id === item.id
        );

        if (stickerIndex !== -1) {
          setActiveStickers(
            activeStickers.filter((sticker, index) => index !== stickerIndex)
          );
        } else {
          console.log("lo");
          return;
        }
      } else {
        console.log("not lo");
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
    dispatch(getBusinesses());
  }, []);

  useEffect(() => {
    if (template) {
      dispatch(reset());

      navigate("/admin/templates");
    }
  }, [template]);

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        {/* ############ Accordion 1 ############ */}
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
        <Accordion defaultExpanded sx={{ background: theme.palette.grey[900] }}>
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
              <TextField
                name="cardName"
                label="Card Name"
                value={formik.values.cardName}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.cardName)}
                helperText={formik.errors.cardName}
                sx={{
                  width: "100%",
                }}
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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Card Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  required
                  name="cardType"
                  value={formik.values.cardType}
                  label="Card Type"
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.cardType)}>
                  {cardTypes.map((item, i) => (
                    <MenuItem
                      key={i}
                      value={item.type}
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
              {formik.values.cardType === "LOYALTY" && (
                <TabPanel onChange={formik.handleChange} formik={formik} />
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ############ Accordion 2 ############ */}
        <Accordion defaultExpanded sx={{ background: theme.palette.grey[900] }}>
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
            <Box display={"flex"} flexWrap={"wrap"} gap={2}>
              {bgs.map(({ id, url }) => (
                <div
                  key={id}
                  className={`card-bg ${
                    activeImg.url === url ? "active" : ""
                  }`}>
                  <img
                    src={url}
                    width={250}
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
                </div>
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
                style={{ maxWidth: "250px", width: "100%", height: "170px" }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ############ Accordion 3 ############ */}
        <Accordion defaultExpanded sx={{ background: theme.palette.grey[900] }}>
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
                <Stack direction="row" spacing={2}>
                  <TextField
                    name="brandName"
                    label="Brand Name"
                    value={formik.values.brandName}
                    onChange={formik.handleChange}
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
                </Stack>
                <Stack direction={"row"} spacing={2}>
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
                      width: "50%",
                    }}
                  />
                  <TextField
                    name="Name"
                    label="Name"
                    type="text"
                    value={formik.values.name}
                    onChange={(e) => {
                      setName(e.target.value);
                      formik.setFieldValue("name", e.target.value);
                    }}
                    error={Boolean(formik.errors.name)}
                    helperText={formik.errors.name}
                    inputProps={{
                      min: 1,
                      max: 30,
                    }}
                    sx={{
                      width: "50%",
                    }}
                  />
                </Stack>
                <Stack direction={"row"}>
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
                            <img src={item.icon} alt="" width={30} />
                          </div>
                        );
                      })}
                    </div>
                  </Box>
                </Stack>
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
                    {scanTypes.map((item) => (
                      <div
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
                        onClick={() => setActiveScanType(item)}>
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

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={loading}>
          submit
        </Button>
      </form>
    </Box>
  );
}

export default CreateTemplateForm;

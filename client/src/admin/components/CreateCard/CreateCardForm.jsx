import {
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
import bg1 from "../../../assets/images/cardsBackgrounds/bg-1.jpg";
import bg2 from "../../../assets/images/cardsBackgrounds/bg-2.jpg";
import bg3 from "../../../assets/images/cardsBackgrounds/bg-3.jpg";
import bg4 from "../../../assets/images/cardsBackgrounds/bg-4.jpg";
import bg5 from "../../../assets/images/cardsBackgrounds/bg-5.jpg";
import icon1 from "../../../assets/images/stickers/meat.png";
import icon2 from "../../../assets/images/stickers/fish.png";
import icon3 from "../../../assets/images/stickers/chicken.png";
import icon4 from "../../../assets/images/stickers/sweet-1.png";
import icon5 from "../../../assets/images/stickers/sweet-2.png";
import ScanIcon1 from "../../../assets/images/stickers/barcode_icon-1.png";
import ScanIcon2 from "../../../assets/images/stickers/qrCode_icon-1.png";
import barcode from "../../../assets/images/barcode-1.png";
import qrcode from "../../../assets/images/qrcode.png";

import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import html2canvas from "html2canvas";
import TabPanel from "./LoyaltyTabs";

function CreateCardForm({
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
  const [color, setColor] = useState("#aabbcc");
  const [activeStickers, setActiveStickers] = useState([]);
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      cardName: "",
      cardType: "",
      brandName: "",
      stickersNumber,
      name,
    },
    validationSchema: yup.object({
      cardName: yup.string().required(),
      cardType: yup.string().required(),
      brandName: yup.string().required(),
      name: yup.string().required(),
      stickersNumber: yup.number().required(),
      gift: yup.string().required(),
      giftPoints: yup.number().required(),
      discound: yup.string().required(),
      discoundPoints: yup.number().required(),
      earnedRewards: yup.number(),
      nextGift: yup.number(),
    }),
    onSubmit(values) {
      html2canvas(imgColor, { useCORS: true, x: 0, y: 0 }).then(function (
        canvas
      ) {
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

        const data = {
          ...values,
          logoUrl: logoImg,
          logoText: textLogo,
          nItems: stickersNumber,
          stickersCount: stickersIcons?.length,
          stickers: stickersIcons,
          pointsPerVisit: 10,
          gifts: [
            {
              name: "unlimimted gift",
              priceNPoints: 20,
            },
          ],
          designType: "storeCard",
          activeImg,
          tempPhoto,
          imgData,
          iconUrl: logoImg,
          stripUrl: file,
          cardProps: {
            backgroundColor: "#fff",
            foregroundColor: "#000",
            labelColor: "#fff",
            headerFields: [
              {
                key: "header",
                label: "ORG",
                value: "",
              },
            ],
          },
        };
        console.log({ data });
      });
    },
  });
  const bgs = [
    {
      id: 1,
      url: bg1,
    },
    {
      id: 2,
      url: bg2,
    },
    {
      id: 3,
      url: bg3,
    },
    {
      id: 4,
      url: bg4,
    },
    {
      id: 5,
      url: bg5,
    },
  ];

  const cardTypes = [
    { text: "Loyalty", type: "LOYALTY" },
    { text: "Subscription", type: "ITEMS_SUBSCRIPTION" },
  ];

  const stickersIcons = [
    {
      id: 1,
      icon: icon1,
    },
    {
      id: 2,
      icon: icon2,
    },
    {
      id: 3,
      icon: icon3,
    },
    {
      id: 4,
      icon: icon4,
    },
    {
      id: 5,
      icon: icon5,
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
  const addStickerHandler = (id) => {
    if (formik.values.cardType === "LOYALTY") {
      if (activeStickers.length >= 2) {
        if (activeStickers.includes(id)) {
          setActiveStickers(activeStickers.filter((itemId) => itemId !== id));
        } else {
          return;
          // setActiveStickers([...activeStickers, id]);
        }
      } else {
        if (activeStickers.includes(id)) {
          setActiveStickers(activeStickers.filter((itemId) => itemId !== id));
        } else {
          setActiveStickers([...activeStickers, id]);
        }
      }
    } else {
      if (activeStickers.includes(id)) {
        setActiveStickers(activeStickers.filter((itemId) => itemId !== id));
      } else {
        setActiveStickers([...activeStickers, id]);
      }
    }
  };

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        {/* ############ Accordion 1 ############ */}
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
                      formik.setFieldValue("stickersNumber", e.target.value);
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
                      {stickersIcons.map((item) => (
                        <div
                          className={
                            activeStickers.includes(item.id)
                              ? "icon active"
                              : "icon"
                          }
                          onClick={() => addStickerHandler(item.id)}>
                          {" "}
                          <img src={item.icon} alt="" width={30} />{" "}
                        </div>
                      ))}
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

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          submit
        </Button>
      </form>
    </Box>
  );
}

export default CreateCardForm;

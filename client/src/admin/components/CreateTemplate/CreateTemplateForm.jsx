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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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
  stickersNumber,
  setStickersNumber,
  name,
  // tempPhoto,
  // setTempPhoto,
  // activeImg,
  // setActiveImg,
  // logoImg,
  // setLogoImg,
  // textLogo,
  // setTextLogo,
  // activeIcon,
  // setActiveIcon,
  // setName,
  // activeScanType,
  // setActiveScanType,
  // imgColor,
  // setImgColor,
  // barcode,
  // setBarcode,
  // labelColor,
  // setLabelColor,
  // backgroundColor,
  // setBackgroundColor,
  // headerFieldValue,
  // setHeaderFieldValue,
  // headerFieldLabel,
  // setHeaderFieldLabel,
  // textColor,
  // setTextColor,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    template,
    cardType,
    sharedProps,
    normalCardsTemplate,
    couponCardsTemplate,
    errors,
    loading,
  } = useSelector((state) => state.templates);
  const {
    name: couponname,
    startDate: couponstartDate,
    endDate: couponendDate,
    occasionName: couponoccasionName,
  } = couponCardsTemplate;
  const {
    textLogo,
    logoImg,
    labelColor,
    textColor,
    backgroundColor,
    headerFieldValue,
    headerFieldLabel,
    activeImg,
    imgColor,
    logoUrl,
    imgUrl,
    iconUrl,
    stripUrl,
    barcode,
    activeScanType,
  } = sharedProps;
  const { businesses } = useSelector((state) => state.businesses);
  const { user } = useSelector((state) => state.auth);
  const [color, setColor] = useState("#aabbcc");
  const [activeStickers, setActiveStickers] = useState([]);
  // const [logoUrl, setLogoUrl] = useState(null);
  // const [stripUrl, setStripUrl] = useState(null);
  // const [newStrip, setNewStrip] = useState(null);
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
      couponStartDate: couponstartDate,
      couponEndDate: couponendDate,
    },
    validationSchema: yup.object({
      cardName: yup.string().required("card name is required"),
      cardType: yup.string().required("card type is required"),
      couponStartDate:
        cardType === "COUPON"
          ? yup.date().required("Start Date is required")
          : yup.date(),
      couponEndDate:
        cardType === "COUPON"
          ? yup.date().required("End Date is required")
          : yup.date(),
      brandName: yup.string(),
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
        // convert logo from blob to file(backend needs it as file).
        const logoFile = new File([logoImg], "logo.png", {
          type: "image/png",
          lastModified: new Date().getTime(),
        });
        // if strip is a color so we have to convert it to an image then to a file
        if (stripUrl.type === "color") {
          const canvas = await html2canvas(stripUrl.color, {
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
          imgs = [
            { type: "stripUrl", file },
            { type: "logo", file: logoFile },
          ];
        } else {
          // if strip is not a color, so it is an image
          // 1. Here if user selected one from our bgs, in this case we don't need to send a req to upload the file, it is already uploaded so just send the file
          if (
            stripUrl.url.includes(
              "https://zajil-bucket.s3.me-south-1.amazonaws.com"
            )
          ) {
            imgs = [{ type: "logo", file: logoFile }];
          } else {
            // 2. Here if the user didn't select any of our bgs, so he will upload an image
            /**
             * a. in this case we will have to send a req to upload the file first,
             * b. then dispatch sharedProps action for stripUrl,
             * c. and finally put strip url in imgs array
             *  */
            imgs = [
              { type: "stripUrl", file: stripUrl.url },
              { type: "logo", file: logoFile },
            ];
          }
        }
        // upload imgs
        const uploadPromises =
          imgs.length > 0 &&
          imgs?.map(async (img) => {
            const form = new FormData();
            form.append("file", img.file);

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
            const { data } = await res.json();
            if (img.type === "logo") {
              // setLogoUrl(imgUrl.data.url);
              dispatch(
                setSharedProps({
                  propName: "logoUrl",
                  propValue: data.url,
                })
              );
            } else if (img.type === "stripUrl") {
              // setStripUrl(imgUrl.data.url);
              dispatch(
                setSharedProps({
                  propName: "stripUrl",
                  propValue: { type: stripUrl.type, url: data.url },
                })
              );
            }
            return data.url;
          });
        const uploadedImgUrls =
          uploadPromises.length > 0 ? await Promise.all(uploadPromises) : [];
        const normalCardData = {
          params: { businessId: values.business },
          data: {
            ...values,
            name: formik.values.cardName,
            logoUrl,
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
            stripUrl: stripUrl.url,
            qrCodeFormat: barcode.type,
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
              // auxiliaryFields: [
              //   {
              //     key: `${Math.floor(Math.random() * 100000000) + 1}`,
              //     label: "",
              //     value: "",
              //   },
              // ],
            },
          },
        };
        const couponCardData = {
          params: { businessId: values.business },
          data: {
            ...values,
            name: formik.values.cardName,
            cardType: cardType.type,
            startDate: couponstartDate,
            endDate: couponendDate,
            occasionName: couponoccasionName,
            logoUrl,
            logoText: "COUPON LOGO",
            // iconUrl: logoUrl || "",
            stripUrl: stripUrl.url,
            designType: "coupon",
            qrCodeFormat: barcode.type,
            cardProps: {
              backgroundColor: hexToRgb(backgroundColor || "#ffffff"),
              labelColor: hexToRgb(labelColor),
              foregroundColor: hexToRgb(textColor),
              headerFields: [
                {
                  key: "header",
                  label: "خصم",
                  value: "{{clientName}}",
                },
              ],
              secondaryFields: [
                {
                  key: "cardName",
                  label: "اسم البطاقة",
                  value: "{{cardName}}",
                },
                {
                  key: "availableUses",
                  label: "الاستخدامات المتاحة",
                  value: "{{availableUses}}",
                },
                {
                  key: "endDate",
                  label: "تاريخ الانتهاء",
                  value: "{{endDate}}",
                },
              ],
            },
          },
        };
        dispatch(
          createTemplate(
            cardType.type === "COUPON" ? couponCardData : normalCardData
          )
        );
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
    { text: "Loyalty", type: "LOYALTY", store: "LOYALTY" },
    {
      text: "Subscription",
      type: "ITEMS_SUBSCRIPTION",
      store: "ITEMS_SUBSCRIPTION",
    },
    { text: "Coupon", type: "COUPON", store: "COUPON" },
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
    // setActiveImg(bg);
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
      setSharedProps({
        propName: "logoImg",
        propValue: url,
      })
    );
    // dispatch(
    //   setSharedProps({
    //     propName: "tempPhoto",
    //     propValue: file,
    //   })
    // );
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
      // setTextLogo(textLogo);
      dispatch(
        setSharedProps({
          propName: "textLogo",
          propValue: textLogo,
        })
      );
    } else if (logoImg) {
      // setLogoImg(logoImg);
      dispatch(
        setSharedProps({
          propName: "logoImg",
          propValue: logoImg,
        })
      );
    }
    if (stickersNumber) {
      setStickersNumber(stickersNumber);
    }
  }, [stickersNumber, textLogo, logoImg]);

  const fileInputClick = (event) => {
    event.target.value = null;
  };
  // Use State
  const addStickerHandler = (item) => {
    if (cardType.type === "LOYALTY") {
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
          elevation={1}
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
                  formik.handleChange(e);
                  dispatch(
                    setCouponCardsTemplate({
                      propName: "name",
                      propValue: e.target.value,
                    })
                  );
                }}
                error={Boolean(formik.errors.cardName)}
                helperText={formik.errors.cardName}
                sx={{
                  width: "100%",
                }}
              />
              {/* Business ID */}
              <FormControl sx={{ my: 2, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-required-label">
                  Business
                </InputLabel>
                <Select
                  name="business"
                  label="Business"
                  value={formik.values.business}
                  error={Boolean(formik.errors.business)}
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
                  name="cardType"
                  value={cardType.type}
                  label="Card Type"
                  onChange={(e) => {
                    console.log(e.target.value);
                    const selectedCardType = cardTypes.find(
                      (item) => item.store === e.target.value
                    );
                    dispatch(setCardType(selectedCardType));
                    formik.handleChange(e);
                  }}
                  error={Boolean(formik.errors.cardType)}>
                  {cardTypes.map((item, i) => (
                    <MenuItem
                      key={i}
                      value={item.store}
                      cardType={item.type}
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
              {cardType.type === "ITEMS_SUBSCRIPTION" && (
                <>
                  <Stack direction={"row"} spacing={2}>
                    <TextField
                      name="itemsNumber"
                      label="Items Number"
                      type="number"
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
              {cardType.type === "LOYALTY" && (
                <Stack direction={"row"} spacing={2} width={"100%"}>
                  <TextField
                    name="giftName"
                    label="Gift"
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
              {cardType.type === "COUPON" && (
                <Stack direction={"row"} spacing={2} width={"100%"}>
                  <TextField
                    name="couponOccasionName"
                    label="Occasion Name"
                    value={formik.values.couponOccasionName}
                    onChange={(e) => {
                      dispatch(
                        setCouponCardsTemplate({
                          propName: "occasionName",
                          propValue: e.target.value,
                        })
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.couponOccasionName)}
                    helperText={formik.errors.couponOccasionName}
                    sx={{
                      width: "100%",
                    }}
                  />
                  {/* Replace it with datepicker of MUI */}
                  {/* <TextField
                    name="couponStartDate"
                    label="Start Date"
                    type="text"
                    required
                    value={formik.values.couponStartDate}
                    onChange={(e) => {
                      dispatch(
                        setCouponCardsTemplate({
                          propName: "startDate",
                          propValue: e.target.value,
                        })
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.couponStartDate)}
                    helperText={formik.errors.couponStartDate}
                    sx={{
                      width: "100%",
                    }}
                  /> */}
                  <DatePicker
                    label="Start Date"
                    value={dayjs(formik.values.couponStartDate)}
                    sx={{ width: "100%" }}
                    minDate={dayjs()}
                    onChange={(value) => {
                      dispatch(
                        setCouponCardsTemplate({
                          propName: "startDate",
                          propValue: value,
                        })
                      );
                      formik.setFieldValue("couponStartDate", value);
                    }}
                  />
                  <DatePicker
                    label="End Date"
                    value={dayjs(formik.values.couponEndDate)}
                    sx={{ width: "100%" }}
                    onChange={(value) => {
                      dispatch(
                        setCouponCardsTemplate({
                          propName: "endDate",
                          propValue: value,
                        })
                      );
                      formik.setFieldValue("couponEndDate", value);
                    }}
                    minDate={dayjs(formik.values.couponStartDate)}
                  />
                  {/* <DatePicker
                    label="End Date"
                    value={formik.values.couponEndDate}
                    sx={{width:"100%"}}
                    onChange={(value) => {
                      dispatch(
                        setCouponCardsTemplate({
                          propName: "endDate",
                          propValue: value,
                        })
                      )
                      formik.setFieldValue("couponEndDate", value);
                    }}
                  /> */}
                  {/* Replace it with datepicker of MUI */}
                  {/* <TextField
                    name="couponEndDate"
                    label="End Date"
                    type="text"
                    required
                    value={formik.values.couponEndDate}
                    onChange={(e) => {
                      dispatch(
                        setCouponCardsTemplate({
                          propName: "endDate",
                          propValue: e.target.value,
                        })
                      );
                      formik.handleChange(e);
                    }}
                    error={Boolean(formik.errors.couponEndDate)}
                    helperText={formik.errors.couponEndDate}
                    sx={{
                      width: "100%",
                    }}
                  /> */}
                </Stack>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ############ Accordion 2 : Strip area(bgs) ############ */}
        <Accordion
          defaultExpanded
          elevation={1}
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
                <Box
                  key={id}
                  flexBasis={"unset !important"}
                  maxWidth={"100%"}
                  className={`card-bg ${stripUrl.url === url ? "active" : ""}`}>
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
                        onClick={() => cardBgHandler({ type: "image", url })}
                        sx={{
                          color: theme.palette.primary[600],
                        }}
                      />
                    </div>
                  </div>
                </Box>
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
                  cardBgHandler({ type: "color", color: newColor });
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
          elevation={1}
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
                {cardType.type !== "COUPON" && (
                  <>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      mt={2}>
                      <TextField
                        name="brandName"
                        label="Brand Name"
                        value={formik.values.brandName}
                        onChange={(e) => {
                          formik.handleChange(e)
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
                          // setHeaderFieldLabel(e.target.value);
                          setSharedProps({
                            propName: "headerFieldLabel",
                            propValue: e.target.value,
                          });
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
                          // setHeaderFieldValue(e.target.value);
                          setSharedProps({
                            propName: "headerFieldValue",
                            propValue: e.target.value,
                          });
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
                          // setActiveScanType(item);
                          // setBarcode(item.type);
                          console.log(item);
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
          elevation={1}
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
                      // setLabelColor(newColor);
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
                      // setBackgroundColor(newColor);
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
                      // setTextColor(newColor);
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

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
import { useState } from "react";
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
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
function CreateCardForm({ tempPhoto, setTempPhoto, activeImg, setActiveImg }) {
  const [color, setColor] = useState("#aabbcc");
  const theme = useTheme();
  const icons = [...Array(50)];

  const formik = useFormik({
    initialValues: {
      cardName: "",
      cardType: "",
      brandName: "",
    },
    validationSchema: yup.object({
      cardName: yup.string().required(),
      cardType: yup.string().required(),
      brandName: yup.string().required(),
    }),
    onSubmit(values) {
      const data = { ...values, activeImg, tempPhoto };
      console.log({ data });
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

  const cardTypes = ["Loyalty", "Subscription"];

  const cardBgHandler = (bg) => {
    setActiveImg(bg);
    console.log({ activeImg, bg });
  };

  const onImageChange = (e) => {
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
    console.log({ file });
    document.getElementById("photo").src = url;
    document.getElementById("logo").src = url;
    setTempPhoto(file);
    // setLogoImg(file);
    console.log({ tempPhoto });
  };

  return (
    <Box sx={{ background: theme.palette.grey[800], p: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        {/* ############ Accordion 1 ############ */}
        <Accordion defaultExpanded>
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
                  "& .MuiOutlinedInput-root": {
                    // outlineColor: "transparent",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    // borderColor: "#7b2cbfff !important",
                  },
                  "& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused": {
                    // color: "#7b2cbfff",
                  },
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
                  error={Boolean(formik.errors.cardType)}
                  // helperText={formik.errors.cardType}
                >
                  {cardTypes.map((type, i) => (
                    <MenuItem key={i} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ############ Accordion 2 ############ */}
        <Accordion defaultExpanded>
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
        <Accordion defaultExpanded>
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
                    {tempPhoto && <img src={""} id="logo" width={50} />}

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
                        multiple={false}
                        accept="image/jpeg,image/jpg,image/png"
                        style={{ display: "none" }}
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
                  <Button variant="outlined">use as logo</Button>
                </Stack>
              </div>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Button type="submit">submit</Button>
      </form>
    </Box>
  );
}

export default CreateCardForm;

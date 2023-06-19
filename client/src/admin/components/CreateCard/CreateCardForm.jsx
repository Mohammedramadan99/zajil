import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
function CreateCardForm() {
  const [color, setColor] = useState("#aabbcc");

  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      cardName: "",
      cardType: "",
    },
    validationSchema: yup.object({
      cardName: yup.string().required(),
      cardType: yup.string().required(),
      // background1: yup.string().required(),
    }),
    onSubmit(values) {
      const data = { ...values, color };
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
  const [activeImg, setActiveImg] = useState();
  const cardBgHandler = (bg) => {
    setActiveImg(bg.url || bg.color);
    console.log({ activeImg, bg });
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
                  className={`card-bg ${activeImg === url ? "active" : ""}`}>
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
                className={`card-bg ${activeImg === color ? "active" : ""}`}
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
                onChange={(newColor) => setColor(newColor)}
                style={{ maxWidth: "250px", width: "100%", height: "170px" }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Button type="submit">submit</Button>
      </form>
    </Box>
  );
}

export default CreateCardForm;

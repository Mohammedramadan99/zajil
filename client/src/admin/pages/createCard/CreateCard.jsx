import React, { useState } from "react";
import Card from "../../components/Cards/Card/Card";
import { Box, Container, Grid, useTheme } from "@mui/material";
import CreateCardForm from "../../components/CreateCard/CreateCardForm";

function CreateCard() {
  const theme = useTheme();
  const [tempPhoto, setTempPhoto] = useState("");
  const [activeImg, setActiveImg] = useState("");
  const [textLogo, setTextLogo] = useState(null);
  const [stickersNumber, setStickersNumber] = useState();
  const [logoImg, setLogoImg] = useState(null);
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
        paddingBlock: 4,
        flexGrow: 1,
      }}>
      <Container>
        <Grid container spacing={2}>
          <Grid xs={9} item>
            <CreateCardForm
              tempPhoto={tempPhoto}
              setTempPhoto={setTempPhoto}
              activeImg={activeImg}
              setActiveImg={setActiveImg}
              textLogo={textLogo}
              setTextLogo={setTextLogo}
              logoImg={logoImg}
              setLogoImg={setLogoImg}
              stickersNumber={stickersNumber}
              setStickersNumber={setStickersNumber}
            />
          </Grid>
          <Grid xs={3} item>
            <div className="sticky">
              <Box width={"100%"} m={"auto"}>
                <Card
                  title="holidays"
                  withControl={false}
                  tempPhoto={tempPhoto}
                  activeImg={activeImg}
                  setActiveImg={setActiveImg}
                  textLogo={textLogo}
                  setTextLogo={setTextLogo}
                  logoImg={logoImg}
                  setLogoImg={setLogoImg}
                  stickersNumber={stickersNumber}
                  setStickersNumber={setStickersNumber}
                />
              </Box>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CreateCard;

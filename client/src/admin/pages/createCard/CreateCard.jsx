import React, { useState } from "react";
import Card from "../../components/Cards/Card/Card";
import { Box, Container, Grid, useTheme } from "@mui/material";
import CreateCardForm from "../../components/CreateCard/CreateCardForm";

function CreateCard() {
  const theme = useTheme();
  const [tempPhoto, setTempPhoto] = useState("");
  const [activeImg, setActiveImg] = useState("");

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

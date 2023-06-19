import React from "react";
import Card from "../../components/Cards/Card/Card";
import { Box, Container, Grid, useTheme } from "@mui/material";
import CreateCardForm from "../../components/CreateCard/CreateCardForm";

function CreateCard() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
        paddingBlock: 4,
        flexGrow: 1,
      }}>
      <Container>
        <Grid container spacing={2}>
          <Grid xs={9} item>
            <CreateCardForm />
          </Grid>
          <Grid xs={3} item>
            <Box width={"100%"} m={"auto"}>
              <Card title="holidays" withControl={false} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CreateCard;

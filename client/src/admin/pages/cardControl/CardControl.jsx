import { Box, Container, useTheme } from "@mui/material";
import React from "react";
import CardControlForm from "../../components/CardControl/CardControlForm";

function CardControl() {
  const theme = useTheme();
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        height: "100vh",
      }}>
      <Container>
        <CardControlForm />
      </Container>
    </Box>
  );
}

export default CardControl;

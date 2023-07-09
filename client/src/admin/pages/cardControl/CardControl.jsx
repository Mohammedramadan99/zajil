import { Box, Container, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import CardControlForm from "../../components/CardControl/CardControlForm";
import { useDispatch } from "react-redux";

import { getCardDetails } from "../../../store/CardSlice";
import { useParams } from "react-router-dom";

function CardControl() {
  const theme = useTheme();
  const { cardId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cardId) {
      dispatch(getCardDetails({ cardId }));
    }
  }, [cardId]);
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

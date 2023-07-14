import { Box, Container, Grid, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import CardControlForm from "../../components/CardControl/CardControlForm";
import { useDispatch, useSelector } from "react-redux";

import { getCardDetails } from "../../../store/CardSlice";
import { useParams } from "react-router-dom";
import ShowCard from "../../components/Cards/Card/ShowCard";

function CardControl() {
  const theme = useTheme();
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const { card, loading, errorMessage } = useSelector((state) => state.cards);

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
        <Grid container>
          <Grid item xs={12} md={9}>
            <CardControlForm />
          </Grid>
          <Grid item xs={3} md={3}>
            {card?.cardTemplate && <ShowCard template={card?.cardTemplate}/>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CardControl;

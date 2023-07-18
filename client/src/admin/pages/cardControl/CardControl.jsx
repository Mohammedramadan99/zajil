import { Box, Container, Grid, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import CardControlForm from "../../components/CardControl/CardControlForm";
import { useDispatch, useSelector } from "react-redux";

import { getCardDetails } from "../../../store/CardSlice";
import { useParams } from "react-router-dom";
import ShowCard from "../../components/Cards/Card/ShowCard";
import BackdropSpinner from "../../../components/Loading/BackdropSpinner";

function CardControl() {
  const theme = useTheme();
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const { card,updating, loading, errorMessage } = useSelector((state) => state.cards);

  useEffect(() => {
    if (cardId) {
      dispatch(getCardDetails({ cardId }));
    }
  }, [cardId]);
  return loading ? (
    <>
      loading
    </>
  ): (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container>
        <Grid container>
        {updating && <BackdropSpinner/>}
          <Grid item xs={12} md={9}>
            <CardControlForm />
          </Grid>
          <Grid item xs={12} sm={6}  md={3} margin={"auto"}>
            {card?.cardTemplate && <ShowCard control={true} template={card}/>}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CardControl;

import { Box, Container, Grid, useTheme } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import CardControlForm from "../../components/CardControl/CardControlForm";
import { useDispatch, useSelector } from "react-redux";

import { getCardDetails,reset } from "../../../store/CardSlice";
import { useParams } from "react-router-dom";
import ShowCard from "../../components/CardControl/ShowCard";
import BackdropSpinner from "../../../components/Loading/BackdropSpinner";
import { toast } from "react-toastify";

function CardControl() {
  const theme = useTheme();
  const { cardId } = useParams();
  const dispatch = useDispatch();
  const { card, updating, loading, errorMessage } = useSelector(
    (state) => state.cards
  );
  const [activeSticker, setActiveSticker] = useState([]);
  useEffect(() => {
    if (cardId) {
      dispatch(getCardDetails({ cardId }));
    }
  }, [cardId]);
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(reset());
    }
  }, [errorMessage]);
  
  return loading ? (
    <>loading</>
  ) : (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container>
        <Grid container>
          {updating && <BackdropSpinner />}
          <Grid item xs={12} md={9}>
            <CardControlForm
              activeSticker={activeSticker}
              setActiveSticker={setActiveSticker}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} margin={"auto"}>
            {card && (
              <ShowCard
                control={true}
                template={card}
                activeSticker={activeSticker}
                setActiveSticker={setActiveSticker}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default memo(CardControl);

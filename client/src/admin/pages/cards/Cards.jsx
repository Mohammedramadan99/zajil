import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BusinessesTabs from "../../components/Cards/Tabs";
import { useDispatch, useSelector } from "react-redux";
import { getCards, reset } from "../../../store/CardSlice";
import { useNavigate } from "react-router-dom";

function Cards() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cards } = useSelector((state) => state.cards);
  const { businesses } = useSelector((state) => state.businesses);

  useEffect(() => {
    dispatch(getCards(businesses[0]?.id));
    dispatch(reset());
  }, [businesses]);
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container>
        <Grid container spacing={2}>
          <Grid xs={12} mb={5}>
            <BusinessesTabs />
          </Grid>
          {cards?.rows?.map((item) => (
            <Grid xs={3} item>
              {" "}
              <Card>
                <CardActionArea>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}>
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        Client Name
                      </span>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.clientName}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        Client Phone
                      </span>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.clientPhone}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <Chip
                    label={
                      item.cardTemplate.cardType === "ITEMS_SUBSCRIPTION"
                        ? "SUBSCRIPTION"
                        : item.cardTemplate.cardType
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      marginInline: "10px",
                      fontSize: "10px",
                      marginBottom: "10px",
                    }}
                    color="warning"
                  />
                </CardActionArea>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                      navigate(`${item.cardTemplate.businessId}/${item.id}`)
                    }>
                    details
                  </Button>
                  <Stack
                    direction={"row"}
                    spacing={2}
                    alignItems={"center"}
                    justifyItems={"center"}>
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      Points
                    </span>
                    <Chip label="0" color="warning" variant="outlined" />
                  </Stack>
                </CardActions>
              </Card>{" "}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Cards;

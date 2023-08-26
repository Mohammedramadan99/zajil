import axios from "axios";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
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
import PageHeader from "../../components/PageHeader/PageHeader";
import { useGetBusinesses } from "../../hooks/Businesses";
import { useGetCards } from "../../hooks/Cards";

function Cards() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cards, loading } = useSelector((state) => state.cards);
  const { businesses } = useSelector((state) => state.businesses);
  const { error: businessesError, isLoading: businessesLoading } =
    useGetBusinesses();
  const { error: cardsError, isLoading: cardsLoading } = useGetCards(
    businesses && businesses[0]?.id
  );
  // useEffect(() => {
  //   if (businesses?.length >= 0) {
  //     // dispatch(getCards(businesses[0]?.id));
  //   }
  // }, [businesses]);
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container>
        <PageHeader title={"Cards"} subTitle={"Here are all your cards"} />
        <Grid container spacing={2}>
          <Grid item xs={12} mb={5}>
            <BusinessesTabs />
          </Grid>
          {businessesLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={businessesLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          {cards &&
            cards?.rows?.map((item) => (
              <Grid lg={3} md={4} sm={6} xs={12} item key={item?.id}>
                {" "}
                <Card>
                  <CardActionArea>
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}>
                      <Stack
                        direction={"row"}
                        spacing={2}
                        alignItems={"center"}>
                        <span style={{ fontSize: "12px", color: "#999" }}>
                          Client Name
                        </span>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.clientName}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={"row"}
                        spacing={2}
                        alignItems={"center"}>
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
          {cards?.rows.length < 1 && (
            <>
              <Typography
                variant="body1"
                textTransform={"capitalize"}
                textAlign={"center"}
                pl={5}
                pt={2}
                color={theme.palette.grey[500]}>
                this business doesn't have cards yet
              </Typography>
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default Cards;

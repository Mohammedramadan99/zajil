import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCardDetails } from "../../../store/CardSlice";
import { useGetCardDetails } from "../../hooks/CardsDetails";

function CardDetails() {
  const theme = useTheme();
  const { card } = useSelector((state) => state.cards);
  const { businessId, cardId } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetCardDetails(cardId);
  // useEffect(() => {
  //   const params = { businessId, cardId };
  //   dispatch(getCardDetails(params));
  // }, []);

  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Paper
        sx={{
          backgroundColor: theme.palette.background.alt,
          maxWidth: 500,
          m: {
            xs: "30px auto",
            lg: "100px auto auto",
          },
          p: "10px 40px 30px",
        }}
        p={5}
        borderRadius={5}>
        <Typography
          variant="h1"
          textTransform={"capitalize"}
          fontWeight={600}
          textAlign={"center"}
          mb={4}
          mt={2}
          //   display={"flex"}
          //           alignItems={"center"}
        >
          <span
            style={{
              display: "inline-block",
              color: theme.palette.primary[500],
              marginRight: "10px",
            }}>
            {card?.cardTemplate?.name}
          </span>
          Card
        </Typography>

        <Stack spacing={2} mb={2}>
          <TextField
            name="id"
            label="ID"
            // defaultValue={` `}
            value={card?.id || ""}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
            sx={{ width: "100%" }}
          />
          <TextField
            name="name"
            label="Client Name"
            // defaultValue={` `}
            value={card?.clientName || ""}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
            sx={{ width: "100%" }}
          />
          <TextField
            name="name"
            label="Phone"
            // defaultValue={` `}
            value={card?.clientPhone || ""}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
            sx={{ width: "100%" }}
          />
        </Stack>

        <Stack direction={"row"} justifyContent={"space-between"}>
          <Chip
            label={card?.cardTemplate?.cardType}
            variant="outlined"
            sx={{
              fontSize: "10px",
              display: "flex",
              width: "fit-content",
              //   margin: "auto",
            }}
            color="warning"
          />
          <Chip label={`Points ${card?.loyaltyCard?.points}`} color="primary" />
        </Stack>
      </Paper>
      {!isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
}

export default CardDetails;

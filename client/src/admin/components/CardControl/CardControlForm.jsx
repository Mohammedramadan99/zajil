import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AddPointToLoyaltyCard,
  redeemGift,
  getCardDetails,
  reset,
} from "../../../store/CardSlice";
import { toast } from "react-toastify";
function CardControlForm({activeSticker, setActiveSticker}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { card, loading, errorMessage } = useSelector((state) => state.cards);
  
  const addPointsHandler = () => {
    dispatch(
      AddPointToLoyaltyCard({
        businessId: card.cardTemplate.businessId,
        cardId: card.id,
      })
    );
  };
  const redeemHandler = () => {
    dispatch(redeemGift());
  };
  const addStickerHandler = (item) => {
    if (card.cardTemplate.cardType === "LOYALTY") {
      const stickerIndex = activeSticker.id === item.id;
      console.log({stickerIndex})

      if (stickerIndex !== -1) {
        return false
      } else {
        setActiveSticker(
          activeSticker.concat({
            id: item.id,
            imageUrl: item.imageUrl,
            title: "test",
            imageType: "png",
          })
        );
      }
    } else {
      const stickerIndex = activeSticker?.find(sticker => sticker.imageUrl === item.imageUrl);
      console.log({ item })
      if (activeSticker.length < card?.itemsSubscriptionCard?.nItems) {
        setActiveSticker(
          activeSticker.concat({
            id: Math.floor(Math.random() * 100000) + 1,
            imageUrl: item.imageUrl,
            title: "test",
            imageType: "png",
          })
        );
      }
      // if (stickerIndex) {
      //   setActiveSticker(activeSticker?.filter(sticker => sticker.imageUrl !== stickerIndex.imageUrl))
      // } else {
      //   setActiveSticker(
      //     activeSticker.concat({
      //       id: Math.floor(Math.random() * 100000) + 1,
      //       imageUrl: item.imageUrl,
      //       title: "test",
      //       imageType: "png",
      //     })
      //   );
      // }
    }
  };
  console.log({ activeSticker });
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
    dispatch(reset());
  }, [errorMessage]);

  return (
    <Box
      maxWidth={500}
      sx={{
        backgroundColor: theme.palette.grey[900],
        m: {
          xs: "30px auto",
          lg: "100px auto auto",
        },
        p: {
          xs: 2,
          lg: 5,
        },
      }}
      borderRadius={5}>
      <Typography
        variant="h1"
        textTransform={"capitalize"}
        fontWeight={600}
        mb={4}
        mt={2}>
        Card{" "}
        <span
          style={{
            display: "inline-block",
            color: theme.palette.primary[500],
          }}>
          Control
        </span>
      </Typography>

      <Stack spacing={2} mb={2}>
        <TextField
          label="ID"
          defaultValue={card?.id || ""}
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
          sx={{ width: "100%" }}
        />
        <TextField
          label="Name"
          defaultValue={card?.clientName || ""}
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
          sx={{ width: "100%" }}
        />
      </Stack>
      {card?.cardTemplate?.cardType === "LOYALTY" && (
        <Box>
          <Typography variant="body2" py={2} color="primary">
            {" "}
            Add Points
          </Typography>
          <Stack direction="row" spacing={2} justifyContent={"space-between"}>
            <Button
              variant="outlined"
              startIcon={<RemoveCircleOutlinedIcon />}
              size="small"
              sx={{ fontSize: "9px" }}
              color="error">
              decrease
            </Button>
            <Chip
              label={card?.loyaltyCard?.points}
              color="warning"
              variant="outlined"
            />
            <Button
              variant="outlined"
              endIcon={<AddCircleOutlinedIcon />}
              color="success"
              size="small"
              sx={{ fontSize: "9px" }}
              onClick={addPointsHandler}>
              increase
            </Button>
          </Stack>
          <Typography variant="body2" py={2} color="primary">
            {" "}
            Redeem Rewards
          </Typography>
          <Stack direction="row" spacing={2} justifyContent={"space-between"}>
            <Button
              variant="outlined"
              startIcon={<RemoveCircleOutlinedIcon />}
              sx={{ fontSize: "9px" }}
              color="error">
              decrease
            </Button>
            <Chip label="0" color="warning" variant="outlined" />
            <Button
              variant="outlined"
              endIcon={<AddCircleOutlinedIcon />}
              sx={{ fontSize: "9px" }}
              color="success"
              onClick={redeemHandler}>
              increase
            </Button>
          </Stack>
        </Box>
      )}
      <Stack
        direction="row"
        spacing={2}
        mt={2}
        justifyContent={"space-between"}>
        <div className="stickers-icons">
          {card?.cardTemplate?.itemsSubscriptionCardTemplate?.stickers?.map(
            (item) => {
              const isActive = activeSticker.id === item.id;
              return (
                <div
                  className={isActive ? "icon active" : "icon"}
                  style={{ padding: "10px" }}
                  onClick={() => addStickerHandler(item)}
                  key={item.id}>
                  <img src={item.imageUrl} alt="" width={20} />
                </div>
              );
            }
          )}
        </div>
      </Stack>
    </Box>
  );
}

export default CardControlForm;

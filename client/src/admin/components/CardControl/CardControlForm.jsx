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
} from "../../../store/CardSlice";

function CardControlForm() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { card, loading, errorMessage } = useSelector((state) => state.cards);
  const [activeSticker, setActiveSticker] = useState({});
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

      if (stickerIndex !== -1) {
        setActiveSticker({});
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
      const stickerIndex = activeSticker.id === item.id;

      if (stickerIndex !== -1) {
        setActiveSticker({});
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
    }
  };
  return loading ? (
    <>loading</>
  ) : (
    <Box
      maxWidth={500}
      sx={{
        backgroundColor: theme.palette.grey[900],
        m: {
          xs: "30px auto",
          lg: "100px auto auto",
        },
      }}
      p={5}
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
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

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
      <Typography variant="body2" py={2} color="primary">
        {" "}
        Add Points
      </Typography>
      <Stack direction="row" spacing={2} justifyContent={"space-between"}>
        <Button
          variant="outlined"
          startIcon={<RemoveCircleOutlinedIcon />}
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
          color="error">
          decrease
        </Button>
        <Chip label="0" color="warning" variant="outlined" />
        <Button
          variant="outlined"
          endIcon={<AddCircleOutlinedIcon />}
          color="success"
          onClick={redeemHandler}>
          increase
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} mt={2} justifyContent={"space-between"}>
        <div className="stickers-icons">
          {card?.cardTemplate?.itemsSubscriptionCardTemplate?.stickers?.map(
            (item) => {
              const isActive = activeSticker.id === item.id;
              return (
                <div
                  className={isActive ? "icon active" : "icon"}
                  style={{padding:"10px"}}
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

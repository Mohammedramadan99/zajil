import {
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

function CardControlForm() {
  const theme = useTheme();

  return (
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
      <Stack spacing={2} mb={2}>
        <TextField
          name="id"
          label="ID"
          defaultValue="2"
          InputProps={{
            readOnly: true,
          }}
          variant="filled"
          sx={{ width: "100%" }}
        />
        <TextField
          name="name"
          label="Name"
          defaultValue="Mohammed Ramadan"
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
        <Chip label="0" color="warning" variant="outlined" />
        <Button
          variant="outlined"
          endIcon={<AddCircleOutlinedIcon />}
          color="success">
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
          color="success">
          increase
        </Button>
      </Stack>
    </Box>
  );
}

export default CardControlForm;

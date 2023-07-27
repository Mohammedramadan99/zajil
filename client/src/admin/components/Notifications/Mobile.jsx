import { Box, Stack, Typography, useTheme } from "@mui/material";
import Phone from "../Cards/Card/Phone/Phone";
import LockSharpIcon from "@mui/icons-material/LockOpen";
import dayjs from "dayjs";
function Mobile({}) {
  const theme = useTheme();
  const now = dayjs().format("HH:mm");

  return (
    <Stack justifyContent={"center"} alignItems={"center"}>
      {/* Card */}
      <Phone>
        <Box textAlign={"center"}>
          <LockSharpIcon color="#fff" sx={{ mt:3 }} />
          <Typography variant="h1" fontWeight={900}>
            {now}
          </Typography>
        </Box>
      </Phone>

      {/* {open && (
        <Dialog
          open={open}
          setOpen={setOpen}
          url={`/card/create/${template.id}/${template.businessId}`}
        />
      )} */}
    </Stack>
  );
}

export default Mobile;

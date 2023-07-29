import { Avatar, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import Phone from "./Phone";
import LockSharpIcon from "@mui/icons-material/LockOpen";
import dayjs from "dayjs";
function Mobile({}) {
  const theme = useTheme();
  const now = dayjs().format("HH:mm");

  return (
    <Stack justifyContent={"center"} alignItems={"center"}>
      {/* Card */}
      <Phone>
      <div className="overlay"></div>
        <Box textAlign={"center"} position={"relative"} zIndex={1}>
          <LockSharpIcon color="#fff" sx={{ mt:3 }} />
          <Typography variant="h1" fontWeight={900}>
            {now}
          </Typography>
        </Box>
        <Box className="blur-light" sx={{backgroundColor:"#fff3",mt:4,mx:2,p:1,borderRadius:"10px"}} position={"relative"} zIndex={1}>
          <Grid container>
            <Grid item sx={4} className="flex">
              <Avatar/>
            </Grid>
            <Grid item sx={8}>
              <Box className="flex-between" py={1}>
                <Typography  pl={1} fontWeight={700}> Hassan Cafe </Typography>
                <Typography variant="body2" color={theme.palette.grey[400]}> now </Typography>
              </Box>
              <Box pl={1}>
                Today's offers are for cofe
              </Box>
            </Grid>
          </Grid>
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

import { Box, Grid, Stack, useTheme } from "@mui/material";
import Logo_1 from "../../../../assets/images/Visa/alrajhi.jsx";
import Logo_2 from "../../../../assets/images/Visa/mada.png";
import Logo_3 from "../../../../assets/images/Visa/visa-1.png";
import simCard from "../../../../assets/images/Visa/sim-card.png";
import { blue } from "@mui/material/colors";
import { purple } from "@mui/material/colors";

function Visa() {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "370px",
          background: `linear-gradient(135deg, rgba(158,159,167,1) 0%, rgba(241,241,241,1) 100%) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "cover",
          //   margin: "auto",
          borderRadius: "20px",
        }}>
        <Stack direction={"row"} justifyContent={"space-between"} px={3}>
          <Box
            sx={{
              fontFamily: "cairo",
              display: "flex",
              flexDirection: "column",
              marginTop: "35px",
              textAlign: "right",
            }}>
            <span>تميز ماسي</span>
            <span>diamond efficent</span>
          </Box>
          <Logo_1 width="120px" />
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"cover"}
          px={3}>
          <Box>
            <img src={simCard} />
          </Box>
          <img
            src={Logo_2}
            width={150}
            style={{ objectFit: "cover", marginRight: "-15px" }}
            alt=""
          />
        </Stack>
        <Stack
          direction={"row"}
          spacing={2}
          fontSize={50}
          // justifyContent={"center"}
          fontWeight={400}
          fontFamily={"sans-serif"}
          color={"#555"}
          px={3}>
          <span>5296</span>
          <span>1020</span>
          <span>9052</span>
          <span>3917</span>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} px={3}>
          <Box fontSize={20} fontWeight={500}>
            MAAN AL YAHYA
          </Box>
          <Box display={"flex"} alignItems={"flex-end"}>
            <img src={Logo_3} width={100} />
          </Box>
        </Stack>
      </Box>
    </>
  );
}

export default Visa;

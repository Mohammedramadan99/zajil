import React, { useState } from "react";
import Phone from "./Phone/Phone";
import cardBg_1 from "../../../../assets/images/card_bg_1.jpg";

import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";

function Card({ title, bg, icon, withControl = true }) {
  const [stampsNumber, setStampsNumber] = useState(10);
  const theme = useTheme();
  return (
    <>
      {/* Card */}
      <Phone>
        <Box
          sx={{
            width: "90%",
            height: "150px",
            background: `url(${bg}) no-repeat`,
            backgroundSize: "cover",
            backgroundPosition: "cover",
            margin: "auto",
            borderRadius: "20px",
          }}>
          <Stack direction={"row"} gap={1} p={1} flexWrap={"wrap"}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Box
                className="flex"
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#fff5",
                  // backdropFilter: "blur(10px)",
                  "& svg": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}>
                {" "}
                {icon}{" "}
              </Box>
            ))}
          </Stack>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} p={2} gap={2}>
          <Box>
            <Typography variant={"body2"} fontWeight={600}>
              {" "}
              Name{" "}
            </Typography>
            <Typography variant={"body2"}> Mohammed </Typography>
          </Box>
          <Box>
            <Typography
              variant={"body2"}
              fontWeight={600}
              textTransform={"capitalize"}>
              stamps until next reward
            </Typography>
            <Typography variant={"body2"}> {stampsNumber - 1} </Typography>
          </Box>
        </Box>
      </Phone>
      {withControl && (
        <>
          <Typography
            variant="h4"
            my={2}
            textTransform={"capitalize"}
            textAlign={"center"}
            fontWeight={600}>
            {title}
          </Typography>
          <ButtonGroup
            sx={{
              flexDirection: "column",
              gap: 1,
              width: "100%",
            }}>
            <Button variant="contained">select</Button>
          </ButtonGroup>
        </>
      )}
    </>
  );
}

export default Card;

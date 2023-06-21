import React, { useEffect, useState } from "react";
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

function Card({
  title,
  bg,
  icon,
  textLogo,
  activeImg,
  logoImg,
  setLogoImg,
  setTextLogo,
  setStickersNumber,
  stickersNumber,
  withControl = true,
}) {
  const [stampsNumber, setStampsNumber] = useState(10);
  const theme = useTheme();
  useEffect(() => {
    // Whenever the textLogo or logoImg props change, update the logo image
    if (textLogo) {
      setLogoImg(null);
      setTextLogo(textLogo);
    } else if (logoImg) {
      setTextLogo(null);
      setLogoImg(logoImg);
    }
    if (stickersNumber) {
      setStickersNumber(stickersNumber);
    }
    console.log({ stickersNumber });
  }, [textLogo, logoImg, stickersNumber]);
  return (
    <>
      {/* Card */}
      <Phone>
        <Stack>
          <Box
            sx={{
              width: "90%",
              minHeight: "90px",
              height: "100%",
              background: `url(${bg}) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "cover",
              margin: "auto",
              borderRadius: "20px",
            }}>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              {/* {textLogo === null && ( */}
              {!textLogo && logoImg && (
                <img
                  src={logoImg}
                  id="photo"
                  width={30}
                  height={30}
                  style={{ borderRadius: "50%" }}
                />
              )}
              {/* )} */}
              {textLogo && <span> {textLogo} </span>}
            </Stack>
            <Stack
              direction={"row"}
              gap={1}
              mt={2}
              flexWrap={"wrap"}
              sx={
                activeImg?.url
                  ? {
                      // p: 1,
                      backgroundImage: `url(${activeImg?.url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      borderRadius: "10px",
                    }
                  : {
                      // p: 1,
                      backgroundColor: activeImg?.color,
                      borderRadius: "10px",
                    }
              }>
              <div
                className="stickers"
                style={
                  stickersNumber > 27
                    ? {
                        gridTemplateColumns: "repeat(auto-fit, 25px)",
                        gridTemplateRows: "repeat(5, 25px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : stickersNumber > 18
                    ? {
                        gridTemplateColumns: "repeat(auto-fit, 25px)",
                        gridTemplateRows: "repeat(4, 25px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : stickersNumber > 6
                    ? {
                        justifyContent: "space-between",
                      }
                    : {}
                }>
                {[...Array(stickersNumber || 1)].map((item) => (
                  <div className="sticker">
                    <div className="icon"></div>
                  </div>
                ))}
              </div>
            </Stack>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            p={2}
            mt={1}
            gap={2}>
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
              <Typography variant={"body2"}> {stickersNumber - 1} </Typography>
            </Box>
          </Box>
        </Stack>
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

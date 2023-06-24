import React, { useEffect, useState, useRef } from "react";
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
import qrCode from "../../../../assets/images/qrcode.png";
import html2canvas from "html2canvas";

function Card({
  title,
  bg,
  icon,
  logoImg,
  setLogoImg,
  setTextLogo,
  setStickersNumber,
  stickersNumber,
  withControl = true,
  textLogo,
  activeImg,
  setActiveImg,
  activeIcon,
  setActiveIcon,
  name,
  setName,
  activeScanType,
  setActiveScanType,
  imgColor,
  setImgColor,
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

  const boxRef = useRef(null);
  const downloadImage = () => {
    const box = boxRef.current;
    setImgColor(box);
    html2canvas(box, { useCORS: true, x: 0, y: 0 }).then(function (canvas) {
      const imgData = canvas.toDataURL("image/png");
      // const link = document.createElement("a");
      // link.download = "image.png";
      // link.href = imgData;
      // link.click();
    });
  };
  useEffect(() => {
    downloadImage();
    console.log({ setActiveImg });
  }, [activeImg.color]);
  console.log({ setActiveImg });

  return (
    <>
      {/* Card */}
      <Phone>
        <Stack>
          <Box
            sx={{
              width: "100%",
              minHeight: "90px",
              height: "100%",
              background: `url(${bg}) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "cover",
              paddingInline: "10px",
              borderRadius: "20px",
            }}>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
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
                      position: "relative",
                      backgroundImage: `url(${activeImg?.url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      borderRadius: "10px",
                    }
                  : {
                      position: "relative",
                    }
              }>
              {activeImg?.color && (
                <div
                  className="strip"
                  ref={boxRef}
                  style={{
                    backgroundColor: activeImg?.color,
                  }}></div>
              )}
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
                  <div className="sticker flex">
                    <div className="icon flex">
                      <img src={activeIcon} alt="" width={20} />
                    </div>
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
              <Typography variant={"body2"}> {name} </Typography>
            </Box>
            <Box>
              <Typography
                variant={"body2"}
                fontWeight={600}
                textTransform={"capitalize"}>
                stamps until next reward
              </Typography>
              <Typography variant={"body2"}>
                {" "}
                {stickersNumber - 1 || 0}{" "}
              </Typography>
            </Box>
          </Box>
          <Box className="flex">
            <div style={{ background: "#fff", padding: "10px" }}>
              <img
                src={activeScanType.icon}
                alt=""
                width={activeScanType.type === "barCode" ? 200 : 80}
                height={80}
              />
            </div>
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
      <Button onClick={downloadImage}>Convert to Image</Button>
    </>
  );
}

export default Card;

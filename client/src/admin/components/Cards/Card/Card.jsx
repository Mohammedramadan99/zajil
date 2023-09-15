import React, { useEffect, useState, useRef } from "react";
import Phone from "./Phone/Phone";
import cardBg_1 from "../../../../assets/images/card_bg_1.jpg";
import qrcode from "../../../../assets/images/qrcode.png";

import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Dialog from "../../../components/Templates/Dialog";
import { useSelector } from "react-redux";

function Card({
  template,
  title,
  bg,
  logoImg,
  setLogoImg,
  setTextLogo,
  setStickersNumber,
  stickersNumber,
  withControl = true,
  textLogo,
  activeImg,
  activeIcon,
  name,
  activeScanType,
  setImgColor,
  labelColor,
  setLabelColor,
  backgroundColor,
  setBackgroundColor,
  barcode,
  headerFieldValue,
  setHeaderFieldValue,
  headerFieldLabel,
  setHeaderFieldLabel,
  textColor,
  setTextColor,
}) {
  const { cardType } = useSelector((state) => state.templates);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  useEffect(() => {
    // Whenever the textLogo or logoImg props change, update the logo image
    if (textLogo) {
      setTextLogo(textLogo);
    } else if (logoImg) {
      setLogoImg(logoImg);
    }
    if (stickersNumber) {
      setStickersNumber(stickersNumber);
    }
    console.log({ stickersNumber });
  }, [textLogo, logoImg, stickersNumber]);

  const boxRef = useRef(null);
  useEffect(() => {
    const box = boxRef.current;
    setImgColor && setImgColor(box);
  }, [activeImg?.color]);

  return (
    <>
      {/* Card */}
      <Phone>
        <Stack
          className={cardType === "coupon" ? "zigzag" : ""}
          sx={{
            background: backgroundColor,
            borderRadius: "10px",
            paddingBlock: "10px",
          }}>
          <Box
            sx={{
              width: "100%",
              minHeight: "90px",
              height: "100%",
              background: `url(${bg}) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "cover",
              paddingInline: "10px",
            }}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              justifyContent={"space-between"}>
              <Box
                display={"flex"}
                gap={2}
                alignItems={"center"}
                justifyContent={"space-between"}>
                {logoImg && (
                  <img src={logoImg} id="photo" width={30} height={30} />
                )}
                {/* )} */}
                {textLogo && (
                  <Typography color={labelColor}> {textLogo} </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="h6" color={labelColor}>
                  {" "}
                  {headerFieldLabel}{" "}
                </Typography>
                <Typography variant="body2" color={textColor}>
                  {" "}
                  {headerFieldValue}{" "}
                </Typography>
              </Box>
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
                  stickersNumber > 20
                    ? {
                        gridTemplateColumns: "repeat(auto-fit, 30px)",
                        gridTemplateRows: "repeat(4, 30px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : stickersNumber > 10
                    ? {
                        // gridTemplateColumns: "repeat(auto-fit, 25px)",
                        // gridTemplateRows: "repeat(3, 25px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : stickersNumber > 8
                    ? {
                        justifyContent: "space-between",
                      }
                    : {}
                }>
                {[...Array(stickersNumber || 1)].map((item, i) => (
                  <div className="sticker flex" key={i}>
                    <div className="icon flex">
                      <img src={activeIcon} alt="" width="100%" />
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
              <Typography variant={"body2"} fontWeight={600} color={labelColor}>
                {" "}
                Name{" "}
              </Typography>
              <Typography variant={"body2"} color={textColor}>
                {" "}
                {name}{" "}
              </Typography>
            </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            color={textColor}
            px={2}
            mb={2}
            gap={2}>
            <Box>
              <Typography variant="body2">Earned Rewards</Typography>
              <Typography variant={"body2"}> 0 </Typography>
            </Box>
            <Box>
              <Typography variant="body2">Next Gift</Typography>
              <Typography variant={"body2"}> 0 </Typography>
            </Box>
          </Box>
          <Box className="flex">
            <div>
              {/* <img
                src={qrcode}
                alt=""
                width={activeScanType?.type === "barCode" ? 200 : 80}
                height={80}
              /> */}
              <img
                src={activeScanType.url}
                alt=""
                width={activeScanType?.type === "barCode" ? 200 : 140}
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
            <Button onClick={() => setOpen(true)}>generate qr code</Button>
          </ButtonGroup>
        </>
      )}
      {open && (
        <Dialog
          open={open}
          setOpen={setOpen}
          url={`/card/create/${template.id}/${template.businessId}`}
        />
      )}
    </>
  );
}

export default Card;

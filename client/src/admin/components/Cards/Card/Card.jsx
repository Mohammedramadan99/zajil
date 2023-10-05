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
import dayjs from "dayjs";

function Card({
  template,
  title,
  bg,
  // logoImg,
  setLogoImg,
  setTextLogo,
  setStickersNumber,
  stickersNumber,
  withControl = true,
  // textLogo,
  // activeIcon,
  name,
  // activeScanType,
  setImgColor,
  // labelColor,
  // setLabelColor,
  // backgroundColor,
  // setBackgroundColor,
  // barcode,
  // headerFieldValue,
  // setHeaderFieldValue,
  // headerFieldLabel,
  // setHeaderFieldLabel,
  // textColor,
  // setTextColor,
}) {
  const { cardType, sharedProps, normalCardsTemplate, couponCardsTemplate } =
    useSelector((state) => state.templates);
  const {
    tempPhoto,
    stripUrl,
    logoImg,
    textLogo,
    activeIcon,
    activeScanType,
    imgColor,
    barcode,
    backgroundColor,
    foregroundColor,
    labelColor,
    headerFieldValue,
    headerFieldLabel,
    textColor,
  } = sharedProps;
  const { occasionName, availableUses, endDate } = couponCardsTemplate;

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
  }, [textLogo, logoImg, stickersNumber]);

  const boxRef = useRef(null);
  useEffect(() => {
    const box = boxRef.current;
    setImgColor && setImgColor(box);
  }, [stripUrl?.color]);

  return (
    <>
      {/* Card */}
      <Phone>
        <Stack
          className={cardType.type === "COUPON" ? "zigzag" : ""}
          sx={{
            minHeight: "430px",
            background: backgroundColor,
            borderRadius: "10px",
            paddingBlock: "10px",
          }}>
          {/* Start Logo and Strip */}
          <Box
            sx={{
              width: "100%",
              minHeight: "90px",
              height: "100%",
              background: `url(${bg}) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "cover",
            }}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              justifyContent={"space-between"}
              paddingInline="10px">
              <Box
                display={"flex"}
                gap={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                paddingTop={cardType.type === "COUPON" ? "1rem" : ".5rem"}>
                {logoImg && (
                  <img src={logoImg.url} id="photo" width={30} height={30} />
                )}
                {/* )} */}
                {textLogo && (
                  <Typography color={labelColor}> {textLogo} </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="h6" color={labelColor}>
                  {headerFieldLabel}
                </Typography>
                <Typography variant="body2" color={textColor}>
                  {headerFieldValue}
                </Typography>
              </Box>
            </Stack>
            <Stack
              direction={"row"}
              gap={1}
              mt={2}
              flexWrap={"wrap"}
              sx={
                stripUrl?.url
                  ? {
                      position: "relative",
                      backgroundImage: `url(${stripUrl?.url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : {
                      position: "relative",
                    }
              }>
              {stripUrl?.color && (
                <div
                  className="strip"
                  ref={boxRef}
                  style={{
                    backgroundColor: stripUrl?.color,
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
          {/* End Logo and Strip */}
          {/* Normal Cards -- Start Name */}
          {cardType.type !== "COUPON" && (
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              paddingTop={2}
              paddingInline={2}
              mt={1}
              gap={2}>
              <Box>
                <Typography
                  variant={"body2"}
                  fontWeight={600}
                  color={labelColor}>
                  Name
                </Typography>
                <Typography variant={"body2"} color={textColor}>
                  {name}
                </Typography>
              </Box>
            </Box>
          )}
          {/* Normal Cards -- End Name */}
          {cardType.type === "COUPON" ? (
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              color={textColor}
              paddingTop={2}
              px={2}
              mb={2}
              gap={2}>
              <Box>
                <Typography fontSize={13} fontWeight={800} variant="body2" color={labelColor}>
                  اسم البطاقة
                </Typography>
                <Typography
                  fontSize={13}
                  fontWeight={800}
                  variant={"body2"}
                  color={textColor}>
                  {occasionName}
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={13} fontWeight={800} variant="body2" color={labelColor}>
                  الاستخدامات المتاحة
                </Typography>
                <Typography
                  fontSize={13}
                  fontWeight={800}
                  variant={"body2"}
                  color={textColor}>
                  {availableUses}
                </Typography>
              </Box>
              <Box>
                <Typography fontSize={13} fontWeight={800} variant="body2" color={labelColor}>
                  تاريخ الانتهاء
                </Typography>
                <Typography
                  fontSize={13}
                  fontWeight={800}
                  variant={"body2"}
                  color={textColor}>
                  {dayjs(endDate).format("DD-MM-YYYY")}
                </Typography>
              </Box>
            </Box>
          ) : (
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
          )}
          <Box className="flex" pb={2}>
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

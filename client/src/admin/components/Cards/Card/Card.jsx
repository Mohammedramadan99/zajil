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
import Dialog from "../../../components/Templates/Dialog";

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
}) {
  const [open, setOpen] = useState(false);
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
  useEffect(() => {
    const box = boxRef.current;
    setImgColor && setImgColor(box);
  }, [activeImg?.color]);

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
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              justifyContent={"space-between"}>
              <Box>
                {logoImg && (
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
              </Box>
              {/* <Box>
                <Typography variant="body1">ORG</Typography>
                <Typography variant="body2">mohammed</Typography>
              </Box> */}
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
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
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
            <div style={{ background: "#fff", padding: "10px" }}>
              <img
                src={activeScanType?.icon}
                alt=""
                width={activeScanType?.type === "barCode" ? 200 : 80}
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
            <Button onClick={() => setOpen(true)}>generate qr code</Button>
          </ButtonGroup>
        </>
      )}
      {open && (
        <Dialog
          open={open}
          setOpen={setOpen}
          url={`http://localhost:5173/admin/cards/new/${template.id}/${template.businessId}`}
        />
      )}
    </>
  );
}

export default Card;

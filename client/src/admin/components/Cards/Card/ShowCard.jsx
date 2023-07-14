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

function ShowCard({
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
  const theme = useTheme();

  const boxRef = useRef(null);
  useEffect(() => {
    const box = boxRef.current;
    setImgColor && setImgColor(box);
  }, [activeImg?.color]);
  console.log("temp", template);
  return (
    <>
      {/* Card */}
      <Phone>
        <Stack
          sx={{
            background: template.design.backgroundColor,
            borderRadius: "10px",
            paddingBlock: "10px",
          }}>
          <Box
            sx={{
              width: "100%",
              minHeight: "90px",
              height: "100%",
              // background: `url(${template.stripUrl}) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "cover",
              paddingInline: "10px",
            }}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              justifyContent={"space-between"}>
              <Box>
                {template.logoUrl && (
                  <img
                    src={template.logoUrl}
                    id="photo"
                    width={30}
                    height={30}
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
                template.stripUrl
                  ? {
                      position: "relative",
                      backgroundImage: `url(${template.stripUrl})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : {
                      position: "relative",
                    }
              }>
              {activeImg?.color && <img src={template.stripUrl} alt="" />}
              <div
                className="stickers"
                style={
                  template.itemsSubscriptionCardTemplate?.stickers?.length > 27
                    ? {
                        gridTemplateColumns: "repeat(auto-fit, 25px)",
                        gridTemplateRows: "repeat(5, 25px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : template.itemsSubscriptionCardTemplate?.stickers?.length >
                      18
                    ? {
                        gridTemplateColumns: "repeat(auto-fit, 25px)",
                        gridTemplateRows: "repeat(4, 25px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : template.itemsSubscriptionCardTemplate?.stickers?.length >
                      6
                    ? {
                        justifyContent: "space-between",
                      }
                    : {}
                }>
                {[
                  ...Array(
                    template.itemsSubscriptionCardTemplate?.stickers?.length ||
                      1
                  ),
                ].map((item, i) => (
                  <div className="sticker flex" key={i}>
                    <div className="icon flex">
                      <img
                        src={
                          template.itemsSubscriptionCardTemplate?.stickers[i]
                            .imageUrl
                        }
                        alt=""
                        width={20}
                      />
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
              <Typography
                variant={"body2"}
                fontWeight={600}
                color={template.design.labelColor}>
                {" "}
                Name{" "}
              </Typography>
              <Typography variant={"body2"} color={template.design.labelColor}>
                {template.name}
              </Typography>
            </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            color={template.design.labelColor}
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
                src={qrcode}
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

export default ShowCard;

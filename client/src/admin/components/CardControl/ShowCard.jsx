import React, { useEffect, useState, useRef, memo } from "react";
import Phone from "./Phone/Phone";
import qrcode from "../../../assets/images/qrcode.png";

import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Dialog from "../Templates/Dialog";

function ShowCard({
  template,
  title,
  withControl = true,
  textLogo,
  activeImg,
  activeScanType,
  setImgColor,
  control,
  activeSticker,
  stats,
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const boxRef = useRef(null);
  useEffect(() => {
    const box = boxRef.current;
    setImgColor && setImgColor(box);
  }, [activeImg?.color]);
  const tempActiveSticker = activeSticker || [];
  const tempnItems = template?.itemsSubscriptionCard?.nItems || 0;
  // console.log("temp", template);
  // console.log("tempActiveSticker", template?.itemsSubscriptionCard?.nItems, tempActiveSticker?.length);
  return (
    <Box mt={stats ? 0 : control ? 12 : "unset"}>
      {/* Card */}
      <Phone>
        <Stack
          sx={{
            background: template.cardTemplate?.design?.backgroundColor,
            borderRadius: "10px",
            paddingBlock: "10px",
          }}>
          <Box
            sx={{
              // width: "100%",
              minHeight: "90px",
              height: "100%",
              // background: `url(${template.stripUrl}) no-repeat`,
              backgroundSize: "cover",
              backgroundPosition: "cover",
              // paddingInline: "10px",
            }}>
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              justifyContent={"space-between"}>
              <Box>
                {template.cardTemplate?.logoUrl && (
                  <img
                    src={template?.cardTemplate?.logoUrl}
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
                template.cardTemplate?.stripUrl
                  ? {
                      position: "relative",
                      backgroundImage: `url(${template.cardTemplate?.stripUrl})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }
                  : {
                      position: "relative",
                    }
              }>
              {activeImg?.color && (
                <img src={template.cardTemplate?.stripUrl} alt="" />
              )}

              <div
                className="stickers"
                style={
                  template.itemsSubscriptionCard?.nItems > 7
                    ? {
                        gridTemplateColumns: "repeat(auto-fit, 25px)",
                        gridTemplateRows: "repeat(5, 25px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : template.itemsSubscriptionCard?.nItems > 15
                    ? {
                        gridTemplateColumns: "repeat(auto-fit, 25px)",
                        gridTemplateRows: "repeat(4, 25px)",
                        justifyContent: "space-between",
                        gap: "5px",
                      }
                    : template.itemsSubscriptionCard?.nItems > 20
                    ? {
                        justifyContent: "space-between",
                      }
                    : {}
                }>
                {template?.chosenStickers?.map((item, i) => (
                  <div className="sticker flex" key={i}>
                    <div className="icon flex">
                      <img src={item?.imageUrl} alt="" width={20} />
                    </div>
                  </div>
                ))}
                {/* {tempActiveSticker &&
                  tempActiveSticker?.map((item, i) => (
                    <div className="sticker flex" key={i}>
                      <div className="icon flex">
                        <img src={item?.imageUrl} alt="" width={20} />
                      </div>
                    </div>
                  ))} */}
                {[...Array(tempnItems - template?.chosenStickers?.length)].map(
                  (item, i) => (
                    <div className="sticker flex" key={i}>
                      <div className="icon flex">
                        {/* <img
                        src={
                          template.itemsSubscriptionCardTemplate?.stickers[i]
                            .imageUrl
                        }
                        alt=""
                        width={20}
                      /> */}
                      </div>
                    </div>
                  )
                )}
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
                color={template.cardTempalate?.design.labelColor}>
                {" "}
                Name{" "}
              </Typography>
              <Typography
                variant={"body2"}
                color={template.cardTemplate?.design.labelColor}>
                {template?.cardTemplate?.name}
              </Typography>
            </Box>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            color={template.cardTemplate?.design.labelColor}
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
      {!control && withControl && (
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
          url={`/card/create/${template?.id}/${template?.businessId}`}
        />
      )}
    </Box>
  );
}

export default memo(ShowCard);

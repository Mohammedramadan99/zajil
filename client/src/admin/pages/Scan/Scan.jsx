import { Box, Container, useTheme } from "@mui/material";
import React, { memo } from "react";
import './Webrtc'
import QRscanner from "../../components/Qrcode/QRscanner";

function Scan() {
  const theme = useTheme();
  return (
    <Box
      padding={2}
      sx={{
        backgroundColor: theme.palette.background.alt,
        minHeight: "100vh",
      }}>
      <Container>
        <Box maxWidth={900} maxHeight={300} height={"100%"} width={"100%"} margin={"auto"}>
          {/* <QrcodeScanner /> */}
          <QRscanner />
        </Box>
      </Container>
    </Box>
  );
}

export default memo(Scan);

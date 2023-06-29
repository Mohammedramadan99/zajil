import { Box, Container, useTheme } from "@mui/material";
import React from "react";
import QrcodeScanner from "../../components/Qrcode/QrcodeScanner";

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
        <Box width={300}>
          <QrcodeScanner />
        </Box>
      </Container>
    </Box>
  );
}

export default Scan;

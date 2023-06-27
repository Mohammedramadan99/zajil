import { Box } from "@mui/material";
import QrCode from "react-qr-code";

function QrCodeGenerator({ url }) {
  return (
    <Box p={2}>
      <QrCode value={url} />
    </Box>
  );
}

export default QrCodeGenerator;

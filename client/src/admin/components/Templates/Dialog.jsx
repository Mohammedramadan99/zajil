import { Box, Dialog, DialogTitle, Typography } from "@mui/material";
import QrCodeGenerator from "../Qrcode/QrcodeGenerator";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SimpleDialog(props) {
  const { setOpen, open, url } = props;
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Link to={url} style={{ padding: " 20px 20px 0" }}>
        {url}
      </Link>
      <Box display={"flex"} justifyContent={"center"}>
        <QrCodeGenerator url={url} />
      </Box>
    </Dialog>
  );
}

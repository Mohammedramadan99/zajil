import { Dialog, DialogTitle } from "@mui/material";
import QrCodeGenerator from "../Qrcode/QrcodeGenerator";

export default function SimpleDialog(props) {
  const { setOpen, open, url } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <QrCodeGenerator url={url} />
    </Dialog>
  );
}

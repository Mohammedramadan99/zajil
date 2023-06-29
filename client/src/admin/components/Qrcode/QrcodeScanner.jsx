import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QrcodeScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let scanner = null;

    const startScanner = async () => {
      scanner = new Html5QrcodeScanner("reader", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      try {
        await scanner.render(success, error);
        setIsScannerRunning(true);
      } catch (err) {
        console.warn(err);
      }
    };

    const success = (result) => {
      if (isScannerRunning) {
        scanner.clear();
        setScanResult(result);
      }
    };

    const error = (err) => {
      console.warn(err);
    };

    startScanner();

    return () => {
      if (isScannerRunning) {
        scanner.stop();
      }
    };
  }, [isScannerRunning]);
  useEffect(() => {
    if (scanResult) {
      navigate(`/admin/cards/control/${scanResult}`);
    }
  }, [scanResult]);

  return (
    <>
      <div>qr code scanner</div>
      {scanResult ? <div>Success: {scanResult} </div> : <div id="reader"></div>}
    </>
  );
}

export default QrcodeScanner;

import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

const QRScanner = (props) => {
  const [cardId, setCardId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cardId) {
      // dispatch(getCardDetails({ caprdId }));
      navigate(`/admin/cards/control/${cardId}`);
    }
  }, [cardId, navigate]);

  const handleScan = (result) => {
    console.log({result})
    if (result) {
      setCardId(result.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <>
      <QrReader
        onResult={handleScan}
        onError={handleError}
        style={{ width: "100%" }}
      />
      <p>{cardId}</p>
    </>
  );
};

export default QRScanner;

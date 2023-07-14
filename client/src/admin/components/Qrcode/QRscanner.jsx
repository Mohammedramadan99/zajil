import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

const QRscanner = (props) => {
  const [cardId, setCardId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (cardId) {
      // dispatch(getCardDetails({ cardId }));
      navigate(`/admin/cards/control/${cardId}`);
    }
  }, [cardId]);

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setCardId(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: "100%" }}
      />
      <p>{cardId}</p>
    </>
  );
};
export default QRscanner;

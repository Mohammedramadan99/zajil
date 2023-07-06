import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRscanner = (props) => {
  const [cardId, setCardId] = useState("");

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

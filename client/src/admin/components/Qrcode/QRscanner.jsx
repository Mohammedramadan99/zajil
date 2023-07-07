import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useDispatch } from "react-redux";

const QRscanner = (props) => {
  const [cardId, setCardId] = useState("");
    const dispatch = useDispatch()
    useEffect(() => {
        if (cardId) {
          dispatch()
      }
    }, [cardId])
    
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

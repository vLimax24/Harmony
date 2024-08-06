import React from "react";
import QRCode from "react-native-qrcode-svg";

const QRCODE = ({ value }: { value: string }) => {
  return (
    <QRCode
      value={value}
      size={175}
      color="white"
      backgroundColor="transparent"
      ecl="H"
    />
  );
};

export default QRCODE;

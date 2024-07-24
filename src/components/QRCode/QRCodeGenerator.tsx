import React from "react";
import QRCode from "react-native-qrcode-svg";

const QRCODE = ({ value }: { value: string }) => {
  return (
    <QRCode
      value={value}
      size={175}
      color="black"
      backgroundColor="white"
      ecl="L"
    />
  );
};

export default QRCODE;

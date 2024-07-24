// app/dashboard/groups/share/[teamId].js

import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import QRCODE from "@/components/QRCode/QRCodeGenerator";

const ShareGroup = () => {
  const { id } = useLocalSearchParams();
  console.log(id);

  return (
    <View className="flex-1 items-center justify-center">
      <QRCODE value={id as string} />
    </View>
  );
};

export default ShareGroup;

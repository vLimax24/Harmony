import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Page() {
  return (
    <View className="flex flex-1 items-center justify-center">
      <Text>Dashboard Route</Text>
      <Link href={"/"}>Home</Link>
    </View>
  );
}

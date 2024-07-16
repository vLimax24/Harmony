import React from "react";
import { Slot } from "expo-router";
import { View } from "react-native";
import Navbar from "@/components/Navbar/Navbar";

export default function TabLayout() {
  return (
    <>
      <View className="px-4 pt-12 flex-1 bg-background">
        <Slot />
      </View>
      <Navbar />
    </>
  );
}

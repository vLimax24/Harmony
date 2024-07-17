import React, { useState, useEffect } from "react";
import { Slot } from "expo-router";
import { View } from "react-native";
import Navbar from "@/components/Navbar/Navbar";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isScannerOpen = await AsyncStorage.getItem("isScannerOpen");
      isScannerOpen === "true" ? setScannerOpen(true) : setScannerOpen(false);
    }, 100);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <View className="flex-1 bg-background">
        <Slot />
      </View>
      {!scannerOpen && <Navbar />}
      <StatusBar style="auto" />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Slot } from "expo-router";
import { View } from "react-native";
import Navbar from "@/components/Navbar/Navbar";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const [navbarOpen, setNavbarOpen] = useState<boolean | null>(false);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isNavbarOpen = await AsyncStorage.getItem("isNavbarOpen");
      isNavbarOpen === "true"
        ? setNavbarOpen(true)
        : isNavbarOpen === "false"
        ? setNavbarOpen(false)
        : setNavbarOpen(null);
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <View className="flex-1 bg-background">
        <Slot />
      </View>
      {navbarOpen === true && <Navbar />}
      <StatusBar style="auto" />
    </>
  );
}

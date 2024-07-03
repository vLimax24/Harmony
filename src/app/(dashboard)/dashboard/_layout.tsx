import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, Slot } from "expo-router";
import { View } from "react-native";
import Navbar from "@/components/Navbar/Navbar";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        style="dark"
      />
      <View className="flex-1 pt-12 px-5">
        <Slot />
      </View>
      <Navbar />
    </>
  );
}

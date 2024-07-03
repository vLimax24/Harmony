import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, Slot } from "expo-router";
import { Pressable } from "react-native";
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
      <Slot />
      <Navbar />
    </>
  );
}

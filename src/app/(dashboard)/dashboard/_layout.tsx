import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, Slot } from "expo-router";
import { Pressable } from "react-native";
import Navbar from "@/components/Navbar/Navbar";

export default function TabLayout() {
  return (
    <>
      <Slot />
      <Navbar />
    </>
  );
}

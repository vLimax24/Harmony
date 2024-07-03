import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import {
  BadgePercent,
  CircleUser,
  CookingPot,
  Home,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("List");
  const navigation = useNavigation();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    router.push(
      tab === "Profile"
        ? "/dashboard/profile"
        : tab === "Home"
        ? "/dashboard"
        : "/" + tab
    );
  };

  return (
    <View className="flex-row items-center justify-around pt-4 pb-6 bg-gray-200">
      <TouchableOpacity
        onPress={() => handleTabPress("Home")}
        className="flex items-center justify-center"
      >
        <Home color={`${activeTab === "Home" ? "#22c55e" : "#5f6b85"}`} />
        <Text className="m-0 text-[10px] font-bold text-gray-500">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("Offer")}
        className="flex items-center justify-center"
      >
        <BadgePercent
          color={`${activeTab === "Offer" ? "#22c55e" : "#5f6b85"}`}
        />
        <Text className="m-0 text-[10px] font-bold text-gray-500">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("Login")}
        className="flex items-center justify-center"
      >
        <CookingPot
          color={`${activeTab === "Login" ? "#22c55e" : "#5f6b85"}`}
        />
        <Text className="m-0 text-[10px] font-bold text-gray-500">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("Profile")}
        className="flex items-center justify-center"
      >
        <CircleUser
          color={`${activeTab === "Profile" ? "#22c55e" : "#5f6b85"}`}
        />
        <Text className="m-0 text-[10px] font-bold text-gray-500">Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

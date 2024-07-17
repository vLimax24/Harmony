import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import {
  Home,
  PieChart,
  CircleUserRound,
  UsersRound,
} from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { i18n } from "@/lib/i18n";
import { GradientIcon } from "../ui/GradientIcon";
import { GradientText } from "../ui/GradientText";

const Navbar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    if (pathname === "/dashboard/profile") {
      setActiveTab("Profile");
    } else if (pathname === "/dashboard") {
      setActiveTab("Home");
    } else if (pathname === "/dashboard/groups") {
      setActiveTab("Groups");
    } else if (pathname === "/dashboard/statistics") {
      setActiveTab("Statistics");
    }
  }, [pathname]);

  const handleTabPress = (
    tab: "Home" | "Groups" | "Statistics" | "Profile"
  ) => {
    router.push(
      tab === "Profile"
        ? "/dashboard/profile"
        : tab === "Home"
        ? "/dashboard"
        : tab === "Groups"
        ? "/dashboard/groups"
        : tab === "Statistics"
        ? "/dashboard/statistics"
        : "/dashboard"
    );
  };

  const renderText = (text, isActive) => {
    return isActive ? (
      <GradientText text={text} style={{ fontWeight: "bold" }} />
    ) : (
      <Text className="font-bold text-sm text-textWhite">{text}</Text>
    );
  };

  return (
    <View className="flex-row items-center justify-around pt-4 pb-6 bg-backgroundShade">
      <TouchableOpacity
        onPress={() => handleTabPress("Home")}
        className="items-center justify-center"
      >
        <GradientIcon
          IconComponent={Home}
          isActive={activeTab === "Home"}
          iconSize={24}
        />
        {renderText(i18n.t("Navbar.home"), activeTab === "Home")}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("Groups")}
        className="items-center justify-center"
      >
        <GradientIcon
          IconComponent={UsersRound}
          isActive={activeTab === "Groups"}
          iconSize={24}
        />
        {renderText(i18n.t("Navbar.groups"), activeTab === "Groups")}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("Statistics")}
        className="items-center justify-center"
      >
        <GradientIcon
          IconComponent={PieChart}
          isActive={activeTab === "Statistics"}
          iconSize={24}
        />
        {renderText(i18n.t("Navbar.statistics"), activeTab === "Statistics")}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("Profile")}
        className="items-center justify-center"
      >
        <GradientIcon
          IconComponent={CircleUserRound}
          isActive={activeTab === "Profile"}
          iconSize={24}
        />
        {renderText(i18n.t("Navbar.profile"), activeTab === "Profile")}
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

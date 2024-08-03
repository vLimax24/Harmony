import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
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

// Utility function to handle navigation
const navigateTo = (tab) => {
  const routes = {
    Home: "/dashboard",
    Profile: "/dashboard/profile",
    Groups: "/dashboard/groups",
    Statistics: "/dashboard/statistics",
  };
  router.push(routes[tab]);
};

// Component for individual tab
const NavTab = ({ tab, IconComponent, activeTab, onPress }) => {
  const isActive = activeTab === tab;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: isActive ? 1.1 : 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(rotateValue, {
          toValue: isActive ? 1 : 0,
          friction: 5,
          tension: 100, // Higher tension for more pronounced bounce
          overshootClamping: true,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(rotateValue, {
        toValue: 0, // Return to original position
        friction: 5,
        tension: 100, // Higher tension for quicker bounce
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, scaleValue, rotateValue]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"], // Rotate by 10 degrees
  });

  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center">
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }, { rotate: rotateInterpolate }],
        }}
      >
        <GradientIcon
          IconComponent={IconComponent}
          isActive={isActive}
          iconSize={24}
        />
      </Animated.View>
      {isActive ? (
        <GradientText
          text={i18n.t(`Navbar.${tab.toLowerCase()}`)}
          style={{ fontWeight: "bold" }}
          className="text-sm"
        />
      ) : (
        <Text className="font-bold text-sm text-textWhite">
          {i18n.t(`Navbar.${tab.toLowerCase()}`)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    switch (pathname) {
      case "/dashboard/profile":
        setActiveTab("Profile");
        break;
      case "/dashboard":
        setActiveTab("Home");
        break;
      case "/dashboard/groups":
        setActiveTab("Groups");
        break;
      case "/dashboard/statistics":
        setActiveTab("Statistics");
        break;
      default:
        setActiveTab("Home");
        break;
    }
  }, [pathname]);

  const tabs = [
    { tab: "Home", IconComponent: Home },
    { tab: "Groups", IconComponent: UsersRound },
    { tab: "Statistics", IconComponent: PieChart },
    { tab: "Profile", IconComponent: CircleUserRound },
  ];

  return (
    <View className="flex-row items-center justify-around pt-4 pb-6 bg-backgroundShade">
      {tabs.map(({ tab, IconComponent }) => (
        <NavTab
          key={tab}
          tab={tab}
          IconComponent={IconComponent}
          activeTab={activeTab}
          onPress={() => navigateTo(tab)}
        />
      ))}
    </View>
  );
};

export default Navbar;

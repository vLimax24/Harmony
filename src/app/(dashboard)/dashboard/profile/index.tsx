import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { api } from "../../../../../convex/_generated/api";
import { PencilLine } from "lucide-react-native";
import { useQuery } from "convex/react";
import NotificationSetup from "@/components/Notifications/NotificationPermissionSwitch";
import { i18n } from "@/lib/i18n";
import { router } from "expo-router";

const index = () => {
  const myUser = useQuery(api.users.getMyUser);

  const profileImage = myUser?.profileImage;
  return (
    <View className="flex-1 pt-12 px-6 gap-4">
      <Text className="text-textWhite font-bold text-2xl">
        {i18n.t("Profile.title")}
      </Text>
      {myUser && (
        <View className="flex-row bg-backgroundShade p-4 rounded-2xl items-center justify-between">
          <View className="flex-row gap-5">
            {profileImage && (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 50, height: 50 }}
                className="rounded-full"
              />
            )}
            <View className="justify-center items-start">
              <Text className="text-textWhite font-bold">{myUser.name}</Text>
              <Text className="text-textWhite font-bold">{myUser.email}</Text>
            </View>
          </View>
          <View className="p-2.5 items-center justify-center rounded-full bg-background">
            <PencilLine color={"#E9E8E8"} size={20} />
          </View>
        </View>
      )}
      <NotificationSetup />
    </View>
  );
};

export default index;

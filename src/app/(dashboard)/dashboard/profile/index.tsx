import React, { useState } from "react";
import { View, Text, Image, Switch } from "react-native";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import NotificationSetup from "@/components/Notifications/NotificationPermissionSwitch";

const index = () => {
  const myUser = useQuery(api.users.getMyUser);

  const profileImage = myUser?.profileImage;
  return (
    <View className="flex-1">
      {myUser && (
        <View className="flex-row gap-5">
          {profileImage && (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 50, height: 50 }}
              className="rounded-full"
            />
          )}
          <View>
            <Text>{myUser.name}</Text>
            <Text>{myUser.email}</Text>
          </View>
        </View>
      )}
      <NotificationSetup />
    </View>
  );
};

export default index;

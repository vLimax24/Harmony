import React, { useState, useEffect, useRef } from "react";
import { Platform, View, Text, TouchableOpacity, Animated } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { i18n } from "@/lib/i18n";
import { useExponentialSmoothing } from "@/hooks/useExponentialSmoothing";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const NotificationSetup = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const updateNotifications = useMutation(api.users.updateNotifications);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const { animatedValue, smoothScroll } = useExponentialSmoothing(0, 0.75);

  useEffect(() => {
    if (notificationsEnabled) {
      registerForPushNotificationsAsync().then(
        (token) => token && setExpoPushToken(token)
      );

      if (Platform.OS === "android") {
        Notifications.getNotificationChannelsAsync().then((value) =>
          setChannels(value ?? [])
        );
      }
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });

      return () => {
        notificationListener.current &&
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
        responseListener.current &&
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
      };
    }
  }, [notificationsEnabled]);

  const handleToggleSwitch = (value) => {
    setNotificationsEnabled(value);
    updateNotifications({ notifications: value });
    smoothScroll(value ? 1 : 0); // Animate to 1 (right) or 0 (left)
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-backgroundShade rounded-2xl">
      <View className="w-64">
        <Text className="text-wrap text-textWhite font-bold">
          {i18n.t("Profile.notifications.title")}
        </Text>
        <Text className="text-wrap text-textGray text-sm">
          {i18n.t("Profile.notifications.description")}
        </Text>
      </View>
      <TouchableOpacity
        className={`w-12 h-7 rounded-full flex items-center justify-center ${
          notificationsEnabled ? "bg-blue-600" : "bg-gray-400"
        }`}
        onPress={() => handleToggleSwitch(!notificationsEnabled)}
      >
        <Animated.View
          className="w-6 h-6 bg-white rounded-full"
          style={{
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-24, 24],
                }),
              },
            ],
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationSetup;

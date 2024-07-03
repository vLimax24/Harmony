import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { i18n } from "@/lib/i18n";
import { StatusBar } from "expo-status-bar";
import { GoogleAuth } from "@/components/auth/oAuth/GoogleAuth";
import { AppleAuth } from "@/components/auth/oAuth/AppleAuth";

export default function Page() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();

  const snapPoints = ["55%"];

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../../assets/auth/WelcomePage.png")}
        className="flex-1 px-4 items-start pt-8 justify-end flex-col"
        style={{
          justifyContent: "flex-end",
          paddingBottom: 20,
        }}
        resizeMode="cover"
      >
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          style="dark"
        />
        <View className="w-full">
          <Text className="text-4xl font-bold">
            {i18n.t("Onboarding.welcomeMessage")}
          </Text>
          <Button onPress={handleOpenPress} className="mt-4 bg-primary w-full">
            <Text className="text-white text-lg font-bold">
              {i18n.t("Onboarding.getStarted")}
            </Text>
          </Button>
        </View>
      </ImageBackground>
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        index={-1}
        style={{
          elevation: Platform.OS === "android" ? 50 : 0,
        }}
      >
        <BottomSheetView className="px-8 py-3 justify-between h-[90%]">
          <View>
            <View className="flex-row justify-between items-start">
              <View className="items-start p-4 bg-gray-100/50 w-16 rounded-2xl">
                <Image
                  className="size-8 object-contain"
                  source={require("../../../assets/auth/Star.png")}
                />
              </View>
              <TouchableOpacity
                className="p-1.5 bg-[#f8f3f7] rounded-full"
                onPress={handleClosePress}
              >
                <X color={"#c3bfc3"} size={20} />
              </TouchableOpacity>
            </View>
            <View className="mt-6">
              <Text className="text-4xl font-bold">
                {i18n.t("Onboarding.getStarted")}
              </Text>
              <Text className="mt-1 text-gray-500">
                {i18n.t("Onboarding.getStartedDescription")}
              </Text>
            </View>
          </View>
          <View className="mt-4 grid grid-rows-3 gap-1">
            <Button
              className="bg-[#628BF7]"
              textClassName="text-white font-bold"
              onPress={() => router.push("/signUp")}
            >
              {i18n.t("Onboarding.signUp")}
            </Button>
            <Button
              className="bg-[#eeebee]"
              textClassName="font-bold text-black"
              onPress={() => router.push("/signIn")}
            >
              {i18n.t("Onboarding.signIn")}
            </Button>
            <View className="flex-row w-full gap-1">
              <GoogleAuth />
              <AppleAuth />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

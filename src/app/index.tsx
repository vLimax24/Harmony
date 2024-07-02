import { Link, router } from "expo-router";
import React, { useRef } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { Apple } from "@/assets/Icons/Apple";
import { Google } from "@/assets/Icons/Google";
import { i18n } from "@/lib/i18n";

export default function Page() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();

  const snapPoints = ["55%"];
  return (
    <View className="flex flex-1 items-center justify-center bg-gray-600 pt-8 px-4">
      <Text className="text-white text-xl">Welcome to Lou</Text>
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        index={-1}
      >
        <BottomSheetView className="px-8 py-3 justify-between h-[90%]">
          <View>
            <View className="flex-row justify-between items-start">
              <View className="items-start p-4 bg-gray-100/50 w-16 rounded-2xl">
                <Image
                  className="size-8 object-contain"
                  source={require("../assets/auth/Star.png")}
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
              <Button className="bg-[#eeebee] flex-1">
                <Google />
              </Button>
              <Button className="bg-[#eeebee] flex-1">
                <Apple />
              </Button>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      <Button
        onPress={handleOpenPress}
        className="-z-10 mt-4 bg-primary w-full"
      >
        <Text className="text-white text-lg">Get Started</Text>
      </Button>
    </View>
  );
}

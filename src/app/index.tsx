import { Link } from "expo-router";
import React, { useState, useRef, useCallback } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

export default function Page() {
  const sheetRef = useRef<BottomSheet>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  const snapPoints = ["40%"];
  return (
    <View className="flex flex-1 items-center justify-center bg-gray-500">
      <Text>Welcome to Lou</Text>
      <Link href={"/signIn"}>
        <Text>Sign In</Text>
      </Link>
      <BottomSheet
        snapPoints={snapPoints}
        ref={sheetRef}
        enablePanDownToClose={true}
      >
        <BottomSheetView className="p-4">
          <Text className="font-bold text-xl">Hello World</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

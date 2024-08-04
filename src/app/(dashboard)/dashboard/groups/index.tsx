// index.js
import React, { useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Plus,
  UsersRound,
  Scan,
  TextCursorInput,
  Share2,
  UserRound,
  Settings,
} from "lucide-react-native";
import { i18n } from "@/lib/i18n";
import { GradientText } from "@/components/ui/GradientText";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { router } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { cn } from "@/lib/utils";
import BarcodeScanner from "@/components/ui/BarcodeScanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { Image } from "expo-image";

export const Index = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const getTeamsForUser = useQuery(api.teams.getTeamsForUser);
  const numberOfMembersForTeams = useQuery(
    api.teamMembers.getNumberOfMembersForMultipleTeams,
    {
      teamIds: getTeamsForUser?.map((team) => team._id) || [],
    }
  );

  const handleShareTeam = (teamId: Id<"teams">) => {
    router.push(`/dashboard/groups/share/${teamId}`);
  };

  const handleEditTeam = (teamId: Id<"teams">) => {
    router.push(`/dashboard/groups/edit/${teamId}`);
  };

  const handleOpenPress = () => {
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleSheetClose = () => {
    setSheetOpen(false);
  };

  const handleScannerOpen = async () => {
    await AsyncStorage.setItem("isNavbarOpen", "false");
    setScannerOpen(true);
  };

  const handleScannerClose = async () => {
    await AsyncStorage.setItem("isNavbarOpen", "true");
    setScannerOpen(false);
  };

  const snapPoints = ["30%"];

  const memberCountMap = React.useMemo(() => {
    const map = new Map();
    numberOfMembersForTeams?.forEach(({ teamId, members }) => {
      map.set(teamId, members);
    });
    return map;
  }, [numberOfMembersForTeams]);

  return (
    <ScrollView className="flex-1">
      <View className="flex-1">
        <View className={cn("px-4 pt-12 gap-2")}>
          <Text className="text-textWhite font-bold text-heading">
            {i18n.t("Dashboard.groups.title")}
          </Text>
          <View className="gap-2">
            {getTeamsForUser &&
              getTeamsForUser.map((team) => {
                const memberCount = memberCountMap.get(team._id) || 0;
                return (
                  <View
                    key={team._id}
                    className="flex-row items-center justify-between bg-backgroundShade px-4 py-5 rounded-[12px]"
                  >
                    <View>
                      <Text className="text-textWhite font-bold text-[18px]">
                        {team.name}
                      </Text>
                      <View className="flex-row gap-2 items-center justify-center mt-0.5">
                        <UserRound color={"#7C7C7C"} size={15} />
                        <Text className="text-[#7c7c7c] text-[12px]">
                          {memberCount}{" "}
                          {memberCount === 1
                            ? i18n.t("Dashboard.groups.oneGroupMember")
                            : i18n.t("Dashboard.groups.mutipleGroupMembers")}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2 items-center justify-center py-[6px] px-2 rounded-2xl bg-background">
                      <TouchableOpacity
                        onPress={() => handleShareTeam(team._id)}
                      >
                        <GradientIcon
                          IconComponent={Share2}
                          isActive={true}
                          iconSize={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleEditTeam(team._id)}
                      >
                        <GradientIcon
                          IconComponent={Settings}
                          isActive={true}
                          iconSize={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
          </View>
          <View className="w-full flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-backgroundShade rounded-[10px] py-3 flex-1 flex items-center justify-center"
              onPress={() => router.push("dashboard/groups/create")}
            >
              <GradientIcon
                IconComponent={Plus}
                isActive={true}
                iconSize={20}
              />
              <GradientText
                text={i18n.t("Dashboard.groups.createButton")}
                className="text-[12px] font-bold"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-backgroundShade rounded-[10px] py-3 flex-1 flex items-center justify-center"
              onPress={handleOpenPress}
            >
              <GradientIcon
                IconComponent={UsersRound}
                isActive={true}
                iconSize={20}
              />
              <GradientText
                text={i18n.t("Dashboard.groups.joinButton")}
                className="text-[12px] font-bold"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {sheetOpen && <View style={styles.overlay} pointerEvents="none" />}

      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        index={-1}
        onClose={handleSheetClose}
        backgroundStyle={{ backgroundColor: "#1D1F24" }}
      >
        <BottomSheetView className="px-6 py-3 justify-between h-[90%]">
          <Text className="text-textWhite font-bold text-[17px] mb-4">
            {i18n.t("Dashboard.groups.joinButton")}
          </Text>
          <View className="flex-1 gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-background gap-4 px-8 text-[13px] flex-row rounded-[10px] py-3 flex-1 flex items-center justify-start"
              onPress={handleScannerOpen}
            >
              <GradientIcon
                IconComponent={Scan}
                isActive={true}
                iconSize={20}
              />
              <GradientText
                text={i18n.t("Dashboard.groups.joinWithQRCode")}
                className="text-[12px] font-bold"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-background gap-4 px-8 text-[13px] flex-row rounded-[10px] py-3 flex-1 flex items-center justify-start"
              onPress={handleOpenPress}
            >
              <GradientIcon
                IconComponent={TextCursorInput}
                isActive={true}
                iconSize={20}
              />
              <GradientText
                text={i18n.t("Dashboard.groups.joinWithCode")}
                className="text-[12px] font-bold"
              />
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {isScannerOpen && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        >
          <BarcodeScanner onCancel={handleScannerClose} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});

export default Index;

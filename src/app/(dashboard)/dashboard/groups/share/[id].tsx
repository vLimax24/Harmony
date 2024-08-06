import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { QRCodeShare } from "@/components/shareTeam/QRCodeShare";
import { Id, Doc } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { X } from "lucide-react-native";
import { i18n } from "@/lib/i18n";

const ShareGroup = () => {
  const { id } = useLocalSearchParams();

  const getTeamById: Doc<"teams"> = useQuery(api.teams.getTeamById, {
    teamId: id as Id<"teams">,
  });

  return (
    <View className="flex-1 pt-16 px-4 gap-10">
      <Text className="text-textWhite font-bold text-2xl">
        In {getTeamById?.name} einladen
      </Text>
      <View className="bg-red-500/70 border-2 border-[#e4abab] flex-row gap-3 items-center justify-center py-3 px-10 rounded-2xl">
        <View className="bg-[#fc5758] p-2.5 rounded-full items-center justify-center scale-75">
          <View className="bg-white p-1 rounded-full items-center justify-center">
            <X color={"#fc5758"} size={20} className="pb-1" />
          </View>
        </View>
        <Text className="text-sm pr-3 text-textWhite">
          {i18n.t("Dashboard.groups.joinTeamQRCodeScanInAppAlert")}
        </Text>
      </View>
      <QRCodeShare teamId={id as Id<"teams">} />
    </View>
  );
};

export default ShareGroup;

import { Id } from "convex/_generated/dataModel";
import QRCODE from "./QRCodeGenerator";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { i18n } from "@/lib/i18n";

export const QRCodeShare = ({ teamId }: { teamId: Id<"teams"> }) => {
  return (
    <View className="flex items-center justify-center w-[330px] p-6 py-8 rounded-xl bg-backgroundShade">
      <View className="relative p-16">
        <LinearGradient
          colors={["#4CC3A4", "#8CDF9B"]}
          style={styles.gradientBorder}
          start={[0, 1]}
          end={[1, 0]}
        />
        <QRCODE value={teamId} />
      </View>
      <View className="mt-5 gap-3">
        <Text className="text-left text-wrap text-textWhite font-bold text-[15px]">
          {i18n.t("Dashboard.groups.shareGroup.helperText1")}
        </Text>
        <Text className="text-left text-wrap text-textGray text-[12px]">
          {i18n.t("Dashboard.groups.shareGroup.helperText2")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
    zIndex: -1,
  },
});

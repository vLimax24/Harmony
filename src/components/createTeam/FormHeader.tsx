import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { i18n } from "@/lib/i18n";

export const FormHeader = ({ sheetOpen }: { sheetOpen: boolean }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}
    >
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => router.push("/dashboard/groups")}
        disabled={sheetOpen}
      >
        <ArrowLeft size={24} color={"#E9E8E8"} />
      </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          marginRight: 10,
          color: "#E9E8E8",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {i18n.t("Dashboard.groups.createButton")}
      </Text>
    </View>
  );
};

import { View, Text } from "react-native";
import { i18n } from "@/lib/i18n";
import { TriangleAlert } from "lucide-react-native";

export const AssignmentAlert = () => {
  return (
    <View className="gap-4">
      <Text style={{ color: "#E9E8E8", fontSize: 15, fontWeight: "bold" }}>
        {i18n.t("Dashboard.groups.createGroup.labelTasks")}
      </Text>
      <View
        className="rounded-2xl flex-row items-center justify-center gap-4 p-4 bg-backgroundShade"
        style={{ borderRadius: 12 }}
      >
        <TriangleAlert color={"#FF6D6D"} size={24} />
        <Text style={{ color: "#E9E8E8", fontSize: 12, fontWeight: "bold" }}>
          {i18n.t("Dashboard.groups.createGroup.alertMessage")}
        </Text>
      </View>
    </View>
  );
};

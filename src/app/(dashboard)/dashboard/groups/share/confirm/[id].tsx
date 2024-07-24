import { View, Text, TouchableOpacity } from "react-native";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { Id } from "convex/_generated/dataModel";
import { i18n } from "@/lib/i18n";
import { router } from "expo-router";

const ConfirmGroup = () => {
  const { id } = useLocalSearchParams();

  const getTeamById = useQuery(api.teams.getTeamById, {
    teamId: id as Id<"teams">,
  });

  const addMember = useMutation(api.teamMembers.addOwnUserToTeam);

  const handleJoinTeam = async () => {
    await addMember({ teamId: id as Id<"teams"> });
    router.push("/dashboard/groups");
  };

  return (
    <View className="flex-1 items-center justify-center">
      {getTeamById && (
        <>
          <Text className="text-textWhite text-heading font-bold">
            {i18n.t("Dashboard.groups.joinTeamConfirmation", {
              name: getTeamById.name,
            })}
          </Text>
          <TouchableOpacity
            className="bg-primary2 rounded-2xl mt-4 px-8 py-3"
            onPress={handleJoinTeam}
          >
            <Text className="text-textWhite font-bold">
              {i18n.t("Dashboard.groups.joinTeam")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={router.back}>
            <Text className="text-textWhite font-bold">
              {i18n.t("Dashboard.groups.cancel")}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ConfirmGroup;

import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc } from "convex/_generated/dataModel";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function Page() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    router.push("/welcome");
  };

  const getAssignedTasksForDay: Doc<"tasks">[] = useQuery(
    api.taskAssignments.getTaskAssignmentForDay
  );

  console.log(getAssignedTasksForDay);
  return (
    <View className="flex flex-1 items-center justify-center">
      {getAssignedTasksForDay && getAssignedTasksForDay.length <= 0 ? (
        <Text className="font-bold text-textWhite">
          No tasks assigned for today
        </Text>
      ) : (
        getAssignedTasksForDay &&
        getAssignedTasksForDay.map((task: Doc<"tasks">) => (
          <Text key={task._id} className="font-bold text-textWhite">
            {task.name}
          </Text>
        ))
      )}
      <Button onPress={handleSignOut}>Sign Out</Button>
    </View>
  );
}

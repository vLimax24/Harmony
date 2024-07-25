import { Link } from "expo-router";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Doc } from "convex/_generated/dataModel";
import { i18n } from "@/lib/i18n";
import { Id } from "convex/_generated/dataModel";

export default function Page() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    router.push("/welcome");
  };

  const getAssignedTasksForDay: Doc<"tasks">[] = useQuery(
    api.taskAssignments.getTaskAssignmentForDay
  );

  const markTaskAsComplete = useMutation(api.completedTasks.markTaskAsComplete);

  const handleMarkAsComplete = async (taskId: Id<"tasks">) => {
    await markTaskAsComplete;
  };

  return (
    <View className="flex flex-1 items-center justify-center">
      {getAssignedTasksForDay && getAssignedTasksForDay.length <= 0 ? (
        <Text className="font-bold text-textWhite">
          {i18n.t("Dashboard.home.noTasksAssigned")}
        </Text>
      ) : (
        <>
          {getAssignedTasksForDay &&
            getAssignedTasksForDay.map((task: Doc<"tasks">) => (
              <>
                <Text key={task._id} className="font-bold text-textWhite">
                  {task.name}
                </Text>

                <TouchableOpacity
                  className="bg-green-500 rounded-2xl mt-4 px-8 py-3"
                  onPress={() => handleMarkAsComplete(task._id)}
                >
                  <Text className="font-bold text-textWhite">
                    {i18n.t("Dashboard.home.markAsCompleteButton")}
                  </Text>
                </TouchableOpacity>
              </>
            ))}
        </>
      )}
      <Button onPress={handleSignOut}>Sign Out</Button>
    </View>
  );
}

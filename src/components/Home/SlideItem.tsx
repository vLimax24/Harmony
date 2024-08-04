import React from "react";
import { Text, View } from "react-native";
import { useTasksWithCompletionStatus } from "@/hooks/useTasksWithCompletionStatus";
import { useMutation } from "convex/react";
import { i18n } from "@/lib/i18n";
import { api } from "convex/_generated/api";
import TaskItem from "./TaskItem";

const SlideItem = ({ team }) => {
  const tasksWithCompletionStatus = useTasksWithCompletionStatus(team._id);
  const markTaskAsComplete = useMutation(api.completedTasks.markTaskAsComplete);

  const handleMarkAsComplete = async (taskId) => {
    await markTaskAsComplete({ taskId, teamId: team._id });
  };

  return (
    <View className="flex-1 px-4 items-center justify-center">
      <View className="pt-16">
        <Text className="text-white text-3xl font-bold">{team.name}</Text>
      </View>

      <View className="flex-1 justify-center items-center">
        {tasksWithCompletionStatus.length === 0 ? (
          <Text className="text-white text-xl font-bold text-center">
            {i18n.t("Dashboard.home.noTasksAssigned")}
          </Text>
        ) : (
          tasksWithCompletionStatus.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onMarkAsComplete={handleMarkAsComplete}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default SlideItem;

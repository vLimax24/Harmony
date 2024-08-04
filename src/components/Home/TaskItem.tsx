import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { i18n } from "@/lib/i18n";
import { Check } from "lucide-react-native";
import { getIconComponent } from "@/lib/getIconComponent";

const getWeekdayName = () => {
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return weekdays[new Date().getDay()];
};

const TaskItem = ({ task, onMarkAsComplete }) => {
  const gradientColors = task.isCompleted
    ? ["#32DF54", "#4CEF6B"]
    : ["#4CC3A4", "#8CDF9B"];

  return (
    <View className="mb-36 items-center w-full gap-4">
      <View className="rounded-full w-72 h-72 items-center justify-center">
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientBorderFullRadius}
          start={[0, 1]}
          end={[1, 0]}
        />
        {task.isCompleted ? (
          <Check size={150} color="#E9E8E8" />
        ) : (
          getIconComponent(task.icon, 123)
        )}
      </View>
      <View className="py-1.5 px-4 bg-backgroundShade rounded-2xl">
        <Text className="text-textWhite font-bold">
          {i18n.t(`Dashboard.groups.createGroup.weekdays.${getWeekdayName()}`)}
        </Text>
      </View>
      <Text className="font-bold text-white text-4xl">{task.name}</Text>
      {task.isCompleted ? (
        <Text className="text-white">
          {i18n.t("Dashboard.home.taskCompleted")}
        </Text>
      ) : (
        <TouchableOpacity
          className="w-full rounded-full mt-4 py-4 px-6 flex items-center justify-center"
          onPress={() => onMarkAsComplete(task._id)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#4CC3A4", "#8CDF9B"]}
            style={styles.gradientBorder}
            start={[0, 1]}
            end={[1, 0]}
          />
          <Text className="font-bold text-white text-xl">
            {i18n.t("Dashboard.home.markAsCompleteButton")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    zIndex: -1,
  },
  gradientBorderFullRadius: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "transparent",
    zIndex: -1,
  },
});

export default TaskItem;

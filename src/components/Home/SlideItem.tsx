import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Easing,
} from "react-native";
import { useTasksWithCompletionStatus } from "@/hooks/useTasksWithcompletionStatus";
import { useMutation } from "convex/react";
import { i18n } from "@/lib/i18n";
import { api } from "convex/_generated/api";

const SlideItem = ({ team }) => {
  const tasksWithCompletionStatus = useTasksWithCompletionStatus(team._id);
  const markTaskAsComplete = useMutation(api.completedTasks.markTaskAsComplete);

  const tasksTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.timing(tasksTranslateY, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [tasksWithCompletionStatus]);

  const handleMarkAsComplete = async (taskId) => {
    console.log(`Marking task ${taskId} as complete for team ${team._id}`);
    await markTaskAsComplete({ taskId, teamId: team._id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.teamNameContainer}>
        <Text style={styles.teamName}>{team.name}</Text>
      </View>

      {tasksWithCompletionStatus.length === 0 ? (
        <Text style={styles.noTasksText}>
          {i18n.t("Dashboard.home.noTasksAssigned")}
        </Text>
      ) : (
        tasksWithCompletionStatus.map((task) => (
          <Animated.View
            key={task._id}
            style={[
              styles.taskContainer,
              {
                transform: [
                  {
                    translateY: tasksTranslateY,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.taskName}>{task.name}</Text>
            {task.isCompleted ? (
              <Text style={styles.taskStatus}>Task completed</Text>
            ) : (
              <TouchableOpacity
                style={styles.markCompleteButton}
                onPress={() => handleMarkAsComplete(task._id)}
              >
                <Text style={styles.buttonText}>
                  {i18n.t("Dashboard.home.markAsCompleteButton")}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  teamNameContainer: {
    marginBottom: 20,
  },
  teamName: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  noTasksText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  taskContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  taskName: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  taskStatus: {
    color: "#FFFFFF",
  },
  markCompleteButton: {
    backgroundColor: "green",
    borderRadius: 20,
    marginTop: 10,
    padding: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default SlideItem;

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Pencil, Trash2, Plus } from "lucide-react-native";
import { getIconComponent } from "@/lib/getIconComponent";
import { i18n } from "@/lib/i18n";

export const TaskItem = ({
  day,
  task,
  index,
  handleEditTask,
  handleDeleteTask,
}) => (
  <View style={styles.taskItem}>
    <View style={styles.taskInfo}>
      {getIconComponent(task.icon, 24)}
      <Text style={styles.taskText}>
        {task.name} (Every {task.frequency} week(s))
      </Text>
    </View>
    <View style={styles.taskActions}>
      <TouchableOpacity
        onPress={() => handleEditTask(day, index)}
        style={styles.editButton}
      >
        <Pencil size={20} color="#E9E8E8" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTask(day, index)}>
        <Trash2 size={20} color="#E9E8E8" />
      </TouchableOpacity>
    </View>
  </View>
);

export const TaskList = ({
  tasks,
  weekdays,
  handleAddTask,
  handleEditTask,
  handleDeleteTask,
}) =>
  weekdays.map((day) => (
    <View key={day} style={styles.dayContainer}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{day}</Text>
      </View>
      {tasks[day] &&
        tasks[day].map((task, index) => (
          <TaskItem
            key={index}
            day={day}
            task={task}
            index={index}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
      <TouchableOpacity
        onPress={() => handleAddTask(day)}
        style={styles.addTaskButton}
      >
        <Text style={styles.addTaskText}>
          {i18n.t("Dashboard.groups.createGroup.addTask")}
        </Text>
        <Plus color={"#E9E8E8"} size={24} />
      </TouchableOpacity>
    </View>
  ));

const styles = StyleSheet.create({
  dayContainer: {
    marginBottom: 16,
    gap: 4,
  },
  dayHeader: {
    backgroundColor: "#1D1F24",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  dayHeaderText: {
    color: "#E9E8E8",
    fontWeight: "bold",
    fontSize: 15,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1D1F24",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2E2E2E",
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskText: {
    color: "#E9E8E8",
    marginLeft: 8,
  },
  taskActions: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 8,
  },
  addTaskButton: {
    backgroundColor: "#1D1F24",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: "row",
  },
  addTaskText: {
    color: "#E9E8E8",
  },
});

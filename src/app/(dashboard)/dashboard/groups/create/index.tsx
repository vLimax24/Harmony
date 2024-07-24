import React, { useState, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useConvexAuth } from "convex/react";
import { ArrowLeft, Trash, Pencil, TriangleAlert } from "lucide-react-native";
import { i18n } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { GradientText } from "@/components/ui/GradientText";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Index = () => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [frequency, setFrequency] = useState("1");
  const [tasks, setTasks] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [teamName, setTeamName] = useState("");
  const bottomSheetRef = useRef(null);
  const snapPoints = ["25%", "50%"];

  const { isAuthenticated } = useConvexAuth();

  const createMultipleTasks = useMutation(api.task.createMultipleTasks);
  const createTeam = useMutation(api.teams.createTeam);
  const addOwnUserToTeam = useMutation(api.teamMembers.addOwnUserToTeam);

  const handleAddTask = (day) => {
    setSelectedDay(day);
    setTaskName("");
    setFrequency("1");
    setEditingTaskId(null);
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleCreateTeam = async (taskIds) => {
    const createdTeamId = await createTeam({ name: teamName, tasks: taskIds });
    router.push("/dashboard/groups");

    return createdTeamId;
  };

  const handleSaveTask = async () => {
    Keyboard.dismiss();

    const taskData = {
      name: taskName,
      frequency: parseInt(frequency, 10),
      weekday: weekdays.indexOf(selectedDay) + 1,
    };

    if (editingTaskId !== null) {
      // Update existing task
      const updatedTasks = { ...tasks };
      updatedTasks[selectedDay][editingTaskId] = taskData;
      setTasks(updatedTasks);
    } else {
      // Add new task
      const updatedTasks = { ...tasks };
      if (!updatedTasks[selectedDay]) {
        updatedTasks[selectedDay] = [];
      }
      updatedTasks[selectedDay].push(taskData);
      setTasks(updatedTasks);
    }

    setTaskName("");
    setFrequency("1");
    setEditingTaskId(null);
    setSheetOpen(false);
    bottomSheetRef.current?.close();
  };

  const handleSubmitForm = async () => {
    const taskIds: Id<"tasks">[] = await handleSubmitTasks();
    const teamId = await handleCreateTeam(taskIds);
    await addOwnUserToTeam({ teamId: teamId });
  };

  const handleEditTask = (day, index) => {
    setSelectedDay(day);
    setTaskName(tasks[day][index].name);
    setFrequency(tasks[day][index].frequency.toString());
    setEditingTaskId(index);
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleDeleteTask = (day, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[day].splice(index, 1);
    if (updatedTasks[day].length === 0) {
      delete updatedTasks[day];
    }
    setTasks(updatedTasks);
  };

  const handleSubmitTasks = async () => {
    const allTasks = [];
    for (const day in tasks) {
      allTasks.push(
        ...tasks[day].map((task) => ({
          name: task.name,
          frequency: task.frequency,
          weekday: weekdays.indexOf(day) + 1,
        }))
      );
    }
    const taskIds = await createMultipleTasks({ tasks: allTasks });

    return taskIds;
  };

  return (
    <>
      <ScrollView scrollEnabled={!sheetOpen}>
        <View className="px-4 pt-12 flex-1 flex-col gap-10">
          <View className="flex-row items-center w-full">
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => router.push("/dashboard/groups")}
              disabled={sheetOpen}
            >
              <ArrowLeft size={24} color={"#E9E8E8"} />
            </TouchableOpacity>
            <Text
              style={{ flex: 1, textAlign: "center", marginRight: 10 }}
              className="text-textWhite text-[16px] font-bold"
            >
              {i18n.t("Dashboard.groups.createButton")}
            </Text>
          </View>
          <View className="gap-2">
            <Text className="text-textWhite font-bold text-[15px]">
              {i18n.t("Dashboard.groups.createGroup.labelName")}
            </Text>
            <TextInput
              cursorColor={"#E9E8E8"}
              className="bg-backgroundShade px-4 py-3 rounded-[12px] text-textWhite"
              editable={!sheetOpen}
              value={teamName}
              onChangeText={(e) => setTeamName(e)}
            />
          </View>

          <View className="gap-4">
            <Text className="text-textWhite font-bold text-[15px]">
              {i18n.t("Dashboard.groups.createGroup.labelTasks")}
            </Text>
            <View className="flex-row items-center justify-center gap-4 p-4 rounded-xl bg-backgroundShade">
              <TriangleAlert color={"#FF6D6D"} size={24} />
              <Text className="text-textWhite text-[12px] font-bold text-wrap">
                {i18n.t("Dashboard.groups.createGroup.attentionMessage")}
              </Text>
            </View>
          </View>
          {weekdays.map((day) => (
            <View key={day} className="mb-4">
              <Text className="text-textWhite font-bold text-[15px]">
                {day}
              </Text>
              {tasks[day] &&
                tasks[day].map((task, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between bg-backgroundShade px-4 py-2 rounded-[12px] mt-2"
                  >
                    <Text className="text-textWhite">
                      {task.name} (Every {task.frequency} week(s))
                    </Text>
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() => handleEditTask(day, index)}
                        className="mr-2"
                      >
                        <Pencil size={20} color="#E9E8E8" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteTask(day, index)}
                      >
                        <Trash size={20} color="#E9E8E8" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              <TouchableOpacity
                onPress={() => handleAddTask(day)}
                className="bg-backgroundShade px-4 py-3 rounded-[12px] mt-2 items-center justify-center"
                disabled={sheetOpen}
              >
                <Text className="text-textWhite">Add Task</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View>
            <TouchableOpacity
              className="bg-backgroundShade px-4 py-5 rounded-[12px] items-center justify-center"
              onPress={handleSubmitForm}
              disabled={sheetOpen}
            >
              <GradientText
                text={i18n.t("Dashboard.groups.createGroup.submitButton")}
                className="text-[20px] font-bold"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {sheetOpen && <View style={styles.overlay} />}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onClose={() => {
          setSelectedDay(null);
          setSheetOpen(false);
        }}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#1D1F24" }}
      >
        <View className="px-4 py-2">
          <Text className="text-textWhite font-bold text-[15px] mb-4">
            {editingTaskId !== null
              ? `Edit Task for ${selectedDay}`
              : `Add Task for ${selectedDay}`}
          </Text>
          <TextInput
            placeholder="Enter task"
            placeholderTextColor="#E9E8E8"
            cursorColor={"#E9E8E8"}
            className="bg-backgroundShade px-4 py-3 rounded-[12px] text-textWhite mb-4"
            value={taskName}
            onChangeText={setTaskName}
          />
          <Text className="text-textWhite font-bold mb-2">
            Frequency (weeks)
          </Text>
          <TextInput
            placeholder="1"
            placeholderTextColor="#E9E8E8"
            cursorColor={"#E9E8E8"}
            keyboardType="numeric"
            className="bg-backgroundShade px-4 py-3 rounded-[12px] text-textWhite mb-4"
            value={frequency}
            onChangeText={setFrequency}
          />
          <TouchableOpacity
            className="bg-backgroundShade px-4 py-5 rounded-[12px] items-center justify-center mt-4"
            onPress={handleSaveTask}
          >
            <Text className="text-textWhite">Save Task</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 0,
    pointerEvents: "auto",
  },
});

export default Index;

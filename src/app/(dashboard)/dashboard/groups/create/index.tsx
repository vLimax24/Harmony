import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { GradientText } from "@/components/ui/GradientText";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Trash2, Pencil, TriangleAlert } from "lucide-react-native";
import {
  WashingMachine,
  Dog,
  Cat,
  Utensils,
  Beef,
  Wrench,
  Hammer,
  Drill,
  Paintbrush,
  CookingPot,
  Stamp,
  Bone,
  Plus,
} from "lucide-react-native";
import { i18n } from "@/lib/i18n";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const iconNames = [
  "WashingMachine",
  "Dog",
  "Cat",
  "Utensils",
  "Beef",
  "Wrench",
  "Hammer",
  "Drill",
  "Paintbrush",
  "CookingPot",
  "Stamp",
  "Bone",
];

const getIconComponent = (iconName, size) => {
  const iconProps = { size, color: "#E9E8E8" };
  switch (iconName) {
    case "WashingMachine":
      return <WashingMachine {...iconProps} />;
    case "Dog":
      return <Dog {...iconProps} />;
    case "Cat":
      return <Cat {...iconProps} />;
    case "Utensils":
      return <Utensils {...iconProps} />;
    case "Beef":
      return <Beef {...iconProps} />;
    case "Wrench":
      return <Wrench {...iconProps} />;
    case "Hammer":
      return <Hammer {...iconProps} />;
    case "Drill":
      return <Drill {...iconProps} />;
    case "Paintbrush":
      return <Paintbrush {...iconProps} />;
    case "CookingPot":
      return <CookingPot {...iconProps} />;
    case "Stamp":
      return <Stamp {...iconProps} />;
    case "Bone":
      return <Bone {...iconProps} />;
    default:
      return null;
  }
};

const Index = () => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [teamName, setTeamName] = useState("");
  const bottomSheetRef = useRef(null);
  const snapPoints = ["65%"];

  const createMultipleTasks = useMutation(api.task.createMultipleTasks);
  const createTeam = useMutation(api.teams.createTeam);
  const addOwnUserToTeam = useMutation(api.teamMembers.addOwnUserToTeam);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      taskName: "",
      frequency: "",
      icon: null,
      teamName: "",
    },
  });

  const handleAddTask = (day) => {
    setSelectedDay(day);
    reset({ taskName: "", frequency: "", icon: null });
    setEditingTaskId(null);
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleCreateTeam = async (taskIds) => {
    const createdTeamId = await createTeam({ name: teamName, tasks: taskIds });
    router.push("/dashboard/groups");
    return createdTeamId;
  };

  const handleSaveTask = async (data) => {
    Keyboard.dismiss();
    const { icon } = data;
    if (!icon) {
      console.log(icon);
      return;
    }

    const taskData = {
      name: data.taskName,
      frequency: parseInt(data.frequency, 10),
      weekday: weekdays.indexOf(selectedDay) + 1,
      icon,
    };

    if (editingTaskId !== null) {
      const updatedTasks = { ...tasks };
      updatedTasks[selectedDay][editingTaskId] = taskData;
      setTasks(updatedTasks);
    } else {
      const updatedTasks = { ...tasks };
      if (!updatedTasks[selectedDay]) {
        updatedTasks[selectedDay] = [];
      }
      updatedTasks[selectedDay].push(taskData);
      setTasks(updatedTasks);
    }

    reset({ taskName: "", frequency: "", icon: null });
    setSheetOpen(false);
    bottomSheetRef.current?.close();
  };

  const handleSubmitForm = async () => {
    const taskIds = await handleSubmitTasks();
    const teamId = await handleCreateTeam(taskIds);
    await addOwnUserToTeam({ teamId: teamId });
  };

  const handleEditTask = (day, index) => {
    setSelectedDay(day);
    setValue("taskName", tasks[day][index].name);
    setValue("frequency", tasks[day][index].frequency.toString());
    setValue("icon", tasks[day][index].icon);
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
          icon: task.icon,
        }))
      );
    }
    const taskIds = await createMultipleTasks({ tasks: allTasks });
    return taskIds;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setValue("icon", item.name)}
      style={[
        styles.iconContainer,
        item.name === getValues("icon") && styles.selectedIconContainer,
      ]}
    >
      {item.name === getValues("icon") && (
        <LinearGradient
          colors={["#4CC3A4", "#8CDF9B"]}
          style={styles.gradientBorder}
          start={[0, 1]}
          end={[1, 0]}
        />
      )}
      {item.icon(40)}
    </TouchableOpacity>
  );

  const data = iconNames.map((key) => ({
    name: key,
    icon: (size) => getIconComponent(key, size),
  }));

  return (
    <>
      <ScrollView scrollEnabled={!sheetOpen}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 48,
            flex: 1,
            flexDirection: "column",
            gap: 40,
          }}
        >
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
          <View style={{ gap: 8 }}>
            <Text
              style={{ color: "#E9E8E8", fontWeight: "bold", fontSize: 15 }}
            >
              {i18n.t("Dashboard.groups.createGroup.labelName")}
            </Text>
            <Controller
              control={control}
              name="teamName"
              rules={{
                required: i18n.t(
                  "Dashboard.groups.createGroup.errors.teamName"
                ),
                minLength: {
                  value: 3,
                  message: i18n.t(
                    "Dashboard.groups.createGroup.errors.teamMinLength"
                  ),
                },
                maxLength: {
                  value: 20,
                  message: i18n.t(
                    "Dashboard.groups.createGroup.errors.teamMaxLength"
                  ),
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  cursorColor={"#E9E8E8"}
                  placeholderTextColor={"#E9E8E8"}
                  placeholder={i18n.t(
                    "Dashboard.groups.createGroup.placeholderName"
                  )}
                  style={{
                    backgroundColor: "#1D1F24",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 12,
                    color: "#E9E8E8",
                  }}
                  editable={!sheetOpen}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.teamName && (
              <Text style={styles.errorText}>{errors.teamName.message}</Text>
            )}
          </View>
          <View style={{ gap: 16 }}>
            <Text
              style={{ color: "#E9E8E8", fontWeight: "bold", fontSize: 15 }}
            >
              {i18n.t("Dashboard.groups.createGroup.labelTasks")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                padding: 16,
                backgroundColor: "#1D1F24",
                borderRadius: 12,
              }}
            >
              <TriangleAlert color={"#FF6D6D"} size={24} />
              <Text
                style={{ color: "#E9E8E8", fontSize: 12, fontWeight: "bold" }}
              >
                {i18n.t("Dashboard.groups.createGroup.alertMessage")}
              </Text>
            </View>
          </View>

          {weekdays.map((day) => (
            <View key={day} style={{ marginBottom: 16, gap: 4 }}>
              <View
                style={{
                  backgroundColor: "#1D1F24",
                  padding: 16,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Text
                  style={{ color: "#E9E8E8", fontWeight: "bold", fontSize: 15 }}
                >
                  {day}
                </Text>
              </View>
              {tasks[day] &&
                tasks[day].map((task, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#1D1F24",
                      padding: 16,
                      borderBottomWidth:
                        index === tasks[day].length - 1 ? 0 : 1,
                      borderBottomColor: "#2E2E2E",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {getIconComponent(task.icon, 24)}
                      <Text style={{ color: "#E9E8E8", marginLeft: 8 }}>
                        {task.name} (Every {task.frequency} week(s))
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => handleEditTask(day, index)}
                        style={{ marginRight: 8 }}
                      >
                        <Pencil size={20} color="#E9E8E8" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteTask(day, index)}
                      >
                        <Trash2 size={20} color="#E9E8E8" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              <TouchableOpacity
                onPress={() => handleAddTask(day)}
                style={{
                  backgroundColor: "#1D1F24",
                  padding: 16,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: "#E9E8E8" }}>
                  {i18n.t("Dashboard.groups.createGroup.addTask")}
                </Text>
                <Plus color={"#E9E8E8"} size={24} />
              </TouchableOpacity>
            </View>
          ))}

          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#1D1F24",
                paddingHorizontal: 16,
                paddingVertical: 20,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleSubmit(handleSubmitForm)}
              disabled={sheetOpen}
            >
              <GradientText
                text={i18n.t("Dashboard.groups.createGroup.submitButton")}
                style={{ fontSize: 20, fontWeight: "bold", color: "#E9E8E8" }}
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
        handleIndicatorStyle={{ backgroundColor: "#E9E8E8" }}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
          <Text
            style={{
              color: "#E9E8E8",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 8,
            }}
          >
            {i18n.t("Dashboard.groups.createGroup.labelName")}
          </Text>
          <Controller
            control={control}
            name="taskName"
            rules={{
              required: i18n.t(
                "Dashboard.groups.createGroup.errors.taskRequired"
              ),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={i18n.t(
                  "Dashboard.groups.createGroup.taskPlaceholder"
                )}
                placeholderTextColor="#9E9E9E"
                cursorColor={"#E9E8E8"}
                className="bg-background"
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  color: "#E9E8E8",
                  marginBottom: 8,
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.taskName && (
            <Text style={styles.errorText}>{errors.taskName.message}</Text>
          )}

          <Text
            style={{
              color: "#E9E8E8",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 6,
            }}
          >
            {i18n.t("Dashboard.groups.createGroup.labelFrequency")}
          </Text>
          <Controller
            control={control}
            name="frequency"
            rules={{
              required: i18n.t(
                "Dashboard.groups.createGroup.errors.frequencyRequired"
              ),
              pattern: {
                value: /^[1-9]|10$/,
                message: i18n.t(
                  "Dashboard.groups.createGroup.errors.frequencyPattern"
                ),
              },
              min: {
                value: 1,
                message: i18n.t(
                  "Dashboard.groups.createGroup.errors.frequencyMin"
                ),
              },
              max: {
                value: 10,
                message: i18n.t(
                  "Dashboard.groups.createGroup.errors.frequencyMax"
                ),
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="1"
                placeholderTextColor="#9E9E9E"
                cursorColor={"#E9E8E8"}
                keyboardType="numeric"
                className="bg-background"
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  color: "#E9E8E8",
                  marginBottom: 6,
                }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.frequency && (
            <Text style={styles.errorText}>{errors.frequency.message}</Text>
          )}

          <Text
            style={{
              color: "#E9E8E8",
              fontWeight: "bold",
              fontSize: 15,
              marginBottom: 6,
            }}
          >
            {i18n.t("Dashboard.groups.createGroup.labelIcon")}
          </Text>
          <Controller
            control={control}
            name="icon"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
                numColumns={3}
                columnWrapperStyle={styles.grid}
                scrollEnabled={false}
              />
            )}
          />
          {errors.icon && (
            <Text style={styles.errorText}>
              {i18n.t("Dashboard.groups.createGroup.errorIcon")}
            </Text>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: "#1D1F24",
              paddingHorizontal: 16,
              paddingVertical: 20,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16,
            }}
            onPress={handleSubmit(handleSaveTask)}
          >
            <LinearGradient
              colors={["#4CC3A4", "#8CDF9B"]}
              style={styles.gradientBorder}
              start={[0, 1]}
              end={[1, 0]}
            />
            <Text style={{ color: "#E9E8E8", fontWeight: "bold" }}>
              {i18n.t("Dashboard.groups.createGroup.saveTaskButton")}
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
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
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#131417",
    margin: 4,
    padding: 0,
    aspectRatio: 1,
    borderRadius: 12,
  },
  selectedIconContainer: {
    borderColor: "transparent",
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    zIndex: -1,
  },
  grid: {
    justifyContent: "space-between",
  },
  errorText: {
    color: "#FF6D6D",
    marginBottom: 8,
  },
});

export default Index;

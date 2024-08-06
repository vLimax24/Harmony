import React, { useState, useRef, useEffect } from "react";
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
import { useForm, Controller, set } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Trash2, Pencil, TriangleAlert } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
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
import { useMutation, useQuery } from "convex/react";
import { Id, Doc } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { useLocalSearchParams } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { Image } from "expo-image";
import { weekdays } from "@/lib/helpers";

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
  const { id } = useLocalSearchParams();

  const getMembersForTeam = useQuery(api.teams.getMembersForTeam, {
    teamId: id as Id<"teams">,
  });

  const assignTaskToMember = useMutation(
    api.taskAssignments.assignTaskToMember
  );

  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState({});
  const [teamName, setTeamName] = useState("");
  const [dropdownItems, setDropdownItems] = useState([]);
  const [teamNameError, setTeamNameError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [selectedAssignees, setSelectedAssignees] = useState({});
  const bottomSheetRef = useRef(null);
  const snapPoints = ["65%"];

  const updateOrCreateMultipleTasks = useMutation(
    api.task.updateOrCreateMultipleTasks
  );
  const createTeam = useMutation(api.teams.createTeam);
  const addOwnUserToTeam = useMutation(api.teamMembers.addOwnUserToTeam);
  const team = useQuery(api.teams.getTeamById, { teamId: id as Id<"teams"> });
  const tasksQuery =
    useQuery(api.task.getTasksForTeam, {
      teamId: id as Id<"teams">,
      taskIds: team?.tasks,
    }) || [];

  const checkIfMutipleTasksAreAssigned = useQuery(
    api.task.checkIfMultipleTasksAreAssigned,
    { taskIds: team?.tasks }
  );

  useEffect(() => {
    if (getMembersForTeam) {
      const items = getMembersForTeam.map((member) => ({
        label: member.name,
        value: member._id,
        icon: () => (
          <Image
            source={{ uri: member.profileImage }}
            style={styles.memberImage}
          />
        ),
      }));
      setDropdownItems(items);
    }
  }, [getMembersForTeam]);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
    }
  }, [team]);

  useEffect(() => {
    if (
      checkIfMutipleTasksAreAssigned &&
      checkIfMutipleTasksAreAssigned.length > 0
    ) {
      const assignedUsers = {};
      checkIfMutipleTasksAreAssigned.forEach((taskAssignment) => {
        if (taskAssignment.assigned) {
          assignedUsers[taskAssignment.taskId] = taskAssignment.userId;
        }
      });
      setSelectedAssignees(assignedUsers);
    }
  }, [checkIfMutipleTasksAreAssigned]);

  useEffect(() => {
    if (tasksQuery && tasksQuery.length > 0) {
      tasksQuery.forEach((task) => {
        const selectedDay = weekdays[task.weekday - 1];
        const taskData = {
          _id: task._id,
          name: task.name,
          frequency: task.frequency,
          weekday: weekdays.indexOf(selectedDay) + 1,
          icon: task.icon,
        };

        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          if (editingTaskId !== null) {
            updatedTasks[selectedDay][editingTaskId] = taskData;
          } else {
            if (!updatedTasks[selectedDay]) {
              updatedTasks[selectedDay] = [];
            }
            updatedTasks[selectedDay].push(taskData);
          }
          return updatedTasks;
        });
      });
    }
  }, [tasksQuery]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      taskName: "",
      frequency: "",
      icon: null,
    },
  });

  const handleAddTask = (day) => {
    setSelectedDay(day);
    reset({
      taskName: "",
      frequency: "",
      icon: null,
    });
    setEditingTaskId(null);
    setSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const handleCreateTeam = async (taskIds) => {
    if (!validateTeamName(teamName)) {
      return;
    }

    const createdTeamId = await createTeam({
      name: teamName,
      tasks: taskIds,
    });
    router.push("/dashboard/groups");
    return createdTeamId;
  };

  const handleSaveTask = async (data) => {
    Keyboard.dismiss();
    const { icon } = data;
    if (!icon) {
      return;
    }

    const task = tasks[selectedDay][editingTaskId];
    const taskData = {
      ...(task?._id ? { _id: task._id } : { teamId: id as Id<"teams"> }),
      name: data.taskName,
      frequency: parseInt(data.frequency, 10),
      weekday: weekdays.indexOf(selectedDay) + 1,
      icon,
    };

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      if (editingTaskId !== null) {
        updatedTasks[selectedDay][editingTaskId] = taskData;
      } else {
        if (!updatedTasks[selectedDay]) {
          updatedTasks[selectedDay] = [];
        }
        updatedTasks[selectedDay].push(taskData);
      }
      return updatedTasks;
    });

    reset({
      taskName: "",
      frequency: "",
      icon: null,
    });
    setSheetOpen(false);
    bottomSheetRef.current?.close();
  };

  const handleSubmitForm = async () => {
    const taskIds = await handleSubmitTasks();
    if (!taskIds) return;
    const teamId = await handleCreateTeam(taskIds);
    if (teamId) {
      await addOwnUserToTeam({ teamId: teamId });
    }
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

  const validateTeamName = (name) => {
    if (!name) {
      setTeamNameError(i18n.t("Dashboard.groups.createGroup.errors.teamName"));
      return false;
    } else if (name.length < 3) {
      setTeamNameError(
        i18n.t("Dashboard.groups.createGroup.errors.teamMinLength")
      );
      return false;
    } else if (name.length > 20) {
      setTeamNameError(
        i18n.t("Dashboard.groups.createGroup.errors.teamMaxLength")
      );
      return false;
    } else {
      setTeamNameError("");
      return true;
    }
  };

  const handleValueChange = async (taskId, itemValue) => {
    setSelectedAssignees((prev) => ({
      ...prev,
      [taskId]: itemValue,
    }));
    try {
      await assignTaskToMember({
        teamId: id as Id<"teams">,
        userId: itemValue,
        taskId: taskId,
      });
    } catch (error) {
      console.error("Error assigning task:", error);
    }
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
          ...(task?._id ? { taskId: task._id } : { teamId: id as Id<"teams"> }),
          name: task.name,
          frequency: task.frequency,
          weekday: weekdays.indexOf(day) + 1,
          icon: task.icon,
        }))
      );
    }
    const taskIds = await updateOrCreateMultipleTasks({ tasks: allTasks });
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
              {i18n.t("Dashboard.groups.editButton")}
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <Text
              style={{ color: "#E9E8E8", fontWeight: "bold", fontSize: 15 }}
            >
              {i18n.t("Dashboard.groups.createGroup.labelName")}
            </Text>
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
              onChangeText={(teamName) => {
                setTeamName(teamName);
              }}
              value={teamName}
            />
            {teamNameError ? (
              <Text style={styles.errorText}>{teamNameError}</Text>
            ) : null}
          </View>
          <View style={{ gap: 16 }}>
            <Text
              style={{ color: "#E9E8E8", fontWeight: "bold", fontSize: 15 }}
            >
              {i18n.t("Dashboard.groups.createGroup.labelTasks")}
            </Text>
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
                      backgroundColor: "#1D1F24",
                      padding: 16,
                      borderBottomWidth:
                        index === tasks[day].length - 1 ? 0 : 1,
                      borderBottomColor: "#2E2E2E",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                    <View className="relative">
                      <Picker
                        selectedValue={selectedAssignees[task._id] || ""}
                        onValueChange={(itemValue) =>
                          handleValueChange(task._id, itemValue)
                        }
                        style={styles.picker}
                        mode="dropdown"
                      >
                        <Picker.Item
                          label={
                            selectedAssignees[task._id]
                              ? dropdownItems.find(
                                  (item) =>
                                    item.value === selectedAssignees[task._id]
                                )?.label
                              : "Select Assignee"
                          }
                          value=""
                          style={styles.placeholderItem}
                        />
                        {dropdownItems.map((item) => (
                          <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                            style={styles.item}
                          />
                        ))}
                      </Picker>
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
                marginBottom: 16,
              }}
              onPress={handleSubmitForm}
            >
              <GradientText
                text={i18n.t("Dashboard.groups.createGroup.saveTaskButton")}
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
  memberImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  container: {
    flex: 1,
    padding: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: "#1E1E1E", // Dark background color
    color: "#E9E8E8", // Text color
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333", // Border color
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  placeholderItem: {
    color: "#8C8C8C", // Placeholder text color
    fontStyle: "italic",
  },
  item: {
    color: "#E9E8E8", // Item text color
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

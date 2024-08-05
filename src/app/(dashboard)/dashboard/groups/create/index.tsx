import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { GradientText } from "@/components/ui/GradientText";
import { useForm } from "react-hook-form";
import { Trash2, Pencil, Plus } from "lucide-react-native";
import { TaskBottomSheet } from "@/components/createTeam/TaskBottomSheet";
import { TeamnameForm } from "@/components/createTeam/TeamnameForm";
import { i18n } from "@/lib/i18n";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { FormHeader } from "@/components/createTeam/FormHeader";
import { AssignmentAlert } from "@/components/createTeam/AssignmentAlert";
import { getIconComponent } from "@/lib/getIconComponent";
import { useTeamForm } from "@/hooks/useTeamForm";

const iconData = [
  {
    name: "WashingMachine",
    icon: (size) => getIconComponent("WashingMachine", size),
  },
  { name: "Dog", icon: (size) => getIconComponent("Dog", size) },
  { name: "Cat", icon: (size) => getIconComponent("Cat", size) },
  { name: "Utensils", icon: (size) => getIconComponent("Utensils", size) },
  { name: "Beef", icon: (size) => getIconComponent("Beef", size) },
  { name: "Wrench", icon: (size) => getIconComponent("Wrench", size) },
  { name: "Hammer", icon: (size) => getIconComponent("Hammer", size) },
  { name: "Drill", icon: (size) => getIconComponent("Drill", size) },
  { name: "Paintbrush", icon: (size) => getIconComponent("Paintbrush", size) },
  { name: "CookingPot", icon: (size) => getIconComponent("CookingPot", size) },
  { name: "Stamp", icon: (size) => getIconComponent("Stamp", size) },
  { name: "Bone", icon: (size) => getIconComponent("Bone", size) },
];

const weekdays = [
  i18n.t("Dashboard.groups.createGroup.weekdays.monday"),
  i18n.t("Dashboard.groups.createGroup.weekdays.tuesday"),
  i18n.t("Dashboard.groups.createGroup.weekdays.wednesday"),
  i18n.t("Dashboard.groups.createGroup.weekdays.thursday"),
  i18n.t("Dashboard.groups.createGroup.weekdays.friday"),
  i18n.t("Dashboard.groups.createGroup.weekdays.saturday"),
  i18n.t("Dashboard.groups.createGroup.weekdays.sunday"),
];

const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    errors,
    tasks,
    setTasks,
    teamName,
    setTeamName,
    teamNameError,
    setTeamNameError,
    wasSubmitted,
    setWasSubmitted,
    isTeamNameValid,
    setIsTeamNameValid,
    sheetOpen,
    setSheetOpen,
    selectedDay,
    setSelectedDay,
    bottomSheetRef,
    handleAddTask,
    handleSaveTask,
    handleSubmitForm,
    handleEditTask,
    handleDeleteTask,
  } = useTeamForm();

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
          <FormHeader sheetOpen={sheetOpen} />
          <TeamnameForm
            teamName={teamName}
            setTeamName={setTeamName}
            sheetOpen={sheetOpen}
            setTeamNameSubmitError={setTeamNameError}
            onValidationChange={(isValid) => setIsTeamNameValid(isValid)}
            isSubmitted={wasSubmitted}
          />
          <AssignmentAlert />

          {weekdays.map((day) => (
            <DayTasks
              key={day}
              day={day}
              tasks={tasks[day]}
              handleAddTask={handleAddTask}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
            />
          ))}

          <SubmitButton onPress={handleSubmitForm} />
        </View>
      </ScrollView>

      <TaskBottomSheet
        bottomSheetRef={bottomSheetRef}
        setSelectedDay={setSelectedDay}
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        handleSaveTask={handleSaveTask}
        data={iconData}
      />
    </>
  );
};

const DayTasks = ({
  day,
  tasks,
  handleAddTask,
  handleEditTask,
  handleDeleteTask,
}) => (
  <View style={{ marginBottom: 16, gap: 4 }}>
    <View
      style={{
        backgroundColor: "#1D1F24",
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      <Text style={{ color: "#E9E8E8", fontWeight: "bold", fontSize: 15 }}>
        {day}
      </Text>
    </View>
    <TaskList
      tasks={tasks}
      day={day}
      handleEditTask={handleEditTask}
      handleDeleteTask={handleDeleteTask}
    />
    <AddTaskButton day={day} handleAddTask={handleAddTask} />
  </View>
);

const TaskList = ({ tasks, day, handleEditTask, handleDeleteTask }) => (
  <>
    {tasks &&
      tasks.map((task, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1D1F24",
            padding: 16,
            borderBottomWidth: index === tasks.length - 1 ? 0 : 1,
            borderBottomColor: "#2E2E2E",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            <TouchableOpacity onPress={() => handleDeleteTask(day, index)}>
              <Trash2 size={20} color="#E9E8E8" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
  </>
);

const AddTaskButton = ({ day, handleAddTask }) => (
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
);

const SubmitButton = ({ onPress }) => (
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
    onPress={onPress}
  >
    <GradientText
      text={i18n.t("Dashboard.groups.createGroup.submitButton")}
      style={{ fontSize: 20, fontWeight: "bold", color: "#E9E8E8" }}
    />
  </TouchableOpacity>
);

export default Index;

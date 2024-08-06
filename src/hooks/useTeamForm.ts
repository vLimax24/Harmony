import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { api } from "convex/_generated/api";
import { Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { weekdays } from "@/lib/helpers";

export const useTeamForm = () => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tasks, setTasks] = useState({});
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isTeamNameValid, setIsTeamNameValid] = useState(false);
  const bottomSheetRef = useRef(null);

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
    },
  });

  const handleCreateTeam = async (taskIds) => {
    const createdTeamId = await createTeam({
      name: teamName,
      tasks: taskIds,
    });
    router.push("/dashboard/groups");
    return createdTeamId;
  };

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

  const handleSaveTask = async (data) => {
    Keyboard.dismiss();
    const { icon } = data;
    if (!icon) {
      return;
    }

    const taskData = {
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
    setWasSubmitted(true);
    if (!isTeamNameValid) return;

    const taskIds = await handleSubmitTasks();
    if (!taskIds) return setWasSubmitted(false);
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

  return {
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
    handleSubmitTasks,
  };
};

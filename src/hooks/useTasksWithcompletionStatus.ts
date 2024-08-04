import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export const useTasksWithCompletionStatus = (teamId) => {
  const tasks =
    useQuery(api.taskAssignments.getTaskAssignmentForDay, {
      teamId: teamId,
    }) || [];
  const taskIds = tasks && tasks.map((task) => task._id);

  const taskStatuses =
    (taskIds &&
      useQuery(api.completedTasks.getTasksCompletionStatuses, {
        taskIds: taskIds,
      })) ||
    [];

  return tasks.map((task) => {
    const status = taskStatuses.find((status) => status.taskId === task._id);
    return { ...task, isCompleted: status?.isCompleted || false };
  });
};

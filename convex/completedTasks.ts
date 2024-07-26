import { v } from "convex/values";
import { authQuery, authMutation } from "./util";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const isTaskCompleted = authQuery({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const today = new Date();
    const dayAsNumber = today.getUTCDay() === 0 ? 7 : today.getUTCDay();

    const task = await ctx.db.get(args.taskId);

    const completedTask = await ctx.db
      .query("completedTasks")
      .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
      .filter((q) => q.eq(q.field("createdDate"), formatDate(new Date())))
      .first();

    if (task && task.weekday === dayAsNumber && completedTask !== null) {
      return true;
    } else {
      return false;
    }
  },
});

export const getTasksCompletionStatuses = authQuery({
  args: {
    taskIds: v.array(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const today = new Date();
    const formattedDate = formatDate(today);
    const dayAsNumber = today.getUTCDay() === 0 ? 7 : today.getUTCDay();

    const statuses = await Promise.all(
      args.taskIds.map(async (taskId) => {
        const task = await ctx.db.get(taskId);
        const completedTask = await ctx.db
          .query("completedTasks")
          .withIndex("by_taskId", (q) => q.eq("taskId", taskId))
          .filter((q) => q.eq(q.field("createdDate"), formattedDate))
          .first();

        return {
          taskId,
          isCompleted:
            task && task.weekday === dayAsNumber && completedTask !== null,
        };
      })
    );

    return statuses;
  },
});

export const markTaskAsComplete = authMutation({
  args: { taskId: v.id("tasks"), teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    await ctx.db.insert("completedTasks", {
      taskId: args.taskId,
      userId: ctx.user._id,
      teamId: args.teamId,
      createdDate: formattedDate,
    });
  },
});

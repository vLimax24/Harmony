import { v } from "convex/values";
import { authQuery, authMutation } from "./util";

export const isTaskCompleted = authQuery({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const today = new Date();
    const dayAsNumber = today.getUTCDay() === 0 ? 7 : today.getUTCDay();

    const task = await ctx.db.get(args.taskId);

    if (task && task.weekday === dayAsNumber) {
      return true;
    } else {
      return false;
    }
  },
});
export const markTaskAsComplete = authMutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.insert("completedTasks", {
      taskId: args.taskId,
      userId: ctx.user._id,
    });
  },
});

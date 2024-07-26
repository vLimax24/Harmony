import { v } from "convex/values";
import { authMutation, authQuery } from "./util";
import { Doc } from "./_generated/dataModel";

export const createTask = authMutation({
  args: {
    name: v.string(),
    frequency: v.number(),
    weekday: v.number(),
    icon: v.string(),
  },
  handler: async ({ db }, args) => {
    const newTask = await db.insert("tasks", {
      name: args.name,
      frequency: args.frequency,
      weekday: args.weekday,
      icon: args.icon,
    });
    return newTask;
  },
});

export const createMultipleTasks = authMutation({
  args: {
    tasks: v.array(
      v.object({
        name: v.string(),
        frequency: v.number(),
        weekday: v.number(),
        icon: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const newTaskIds = await Promise.all(
      args.tasks.map(async (task) => {
        const newTaskId = await ctx.db.insert("tasks", {
          name: task.name,
          frequency: task.frequency,
          weekday: task.weekday,
          icon: task.icon,
        });
        return newTaskId;
      })
    );

    return newTaskIds;
  },
});
export const updateTask = authMutation({
  args: {
    taskId: v.id("tasks"),
    name: v.string(),
    frequency: v.number(),
    weekday: v.number(),
  },
  handler: async ({ db }, args) => {
    await db.patch(args.taskId, {
      name: args.name,
      frequency: args.frequency,
      weekday: args.weekday,
    });
  },
});

export const deleteTask = authMutation({
  args: { taskId: v.id("tasks") },
  handler: async ({ db }, args) => {
    await db.delete(args.taskId);
  },
});

export const getTasks = authQuery({
  args: {},
  handler: async ({ db }) => {
    const tasks = await db.query("tasks").collect();
    return tasks;
  },
});

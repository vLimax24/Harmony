import { v } from "convex/values";
import { authMutation, authQuery } from "./util";
import { filter } from "convex-helpers/server/filter";

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

export const updateOrCreateMultipleTasks = authMutation({
  args: {
    tasks: v.array(
      v.object({
        teamId: v.optional(v.id("teams")),
        taskId: v.optional(v.id("tasks")),
        name: v.string(),
        frequency: v.number(),
        weekday: v.number(),
        icon: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.tasks.map(async (task) => {
        if (task.taskId) {
          await ctx.db.patch(task.taskId, {
            name: task.name,
            frequency: task.frequency,
            weekday: task.weekday,
            icon: task.icon,
          });
        } else {
          const taskId = await ctx.db.insert("tasks", {
            name: task.name,
            frequency: task.frequency,
            weekday: task.weekday,
            icon: task.icon,
          });
          if (task.teamId) {
            const team = await ctx.db.get(task.teamId);
            if (team) {
              const existingTasks = Array.isArray(team.tasks) ? team.tasks : [];
              const updatedTasks = [...existingTasks, taskId];
              await ctx.db.patch(task.teamId, {
                tasks: updatedTasks,
              });
            }
          }
        }
      })
    );
  },
});

export const updateTask = authMutation({
  args: {
    taskId: v.id("tasks"),
    name: v.string(),
    frequency: v.number(),
    weekday: v.number(),
    icon: v.string(),
  },
  handler: async ({ db }, args) => {
    await db.patch(args.taskId, {
      name: args.name,
      frequency: args.frequency,
      weekday: args.weekday,
      icon: args.icon,
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

export const getTasksForTeam = authQuery({
  args: { teamId: v.id("teams"), taskIds: v.array(v.id("tasks")) },
  handler: async (ctx, args) => {
    const tasks = await filter(ctx.db.query("tasks"), (task) =>
      args.taskIds.includes(task._id)
    ).collect();
    return tasks;
  },
});

export const getAssigneeForTask = authQuery({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const assignee = await ctx.db
      .query("taskAssignments")
      .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
      .first();

    return assignee;
  },
});

export const checkIfTaskIsAssigned = authQuery({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const assignee = await ctx.db
      .query("taskAssignments")
      .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
      .first();

    return assignee !== null;
  },
});

export const checkIfMultipleTasksAreAssigned = authQuery({
  args: { taskIds: v.array(v.id("tasks")) },
  handler: async (ctx, args) => {
    const assignees = await Promise.all(
      args.taskIds.map(async (taskId) => {
        const assignee = await ctx.db
          .query("taskAssignments")
          .withIndex("by_taskId", (q) => q.eq("taskId", taskId))
          .first();

        return {
          taskId: taskId,
          assigned: assignee !== null,
          userId: assignee?.userId,
        };
      })
    );

    return assignees;
  },
});

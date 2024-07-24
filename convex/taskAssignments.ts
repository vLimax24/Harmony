import { v } from "convex/values";
import { authMutation, authQuery } from "./util";
import { Doc } from "./_generated/dataModel";

export const assignTaskToMember = authMutation({
  args: { taskId: v.id("tasks"), userId: v.id("users") },
  handler: async ({ db }, args) => {
    const newAssignment = await db.insert("taskAssignments", {
      taskId: args.taskId,
      userId: args.userId,
    });
    return newAssignment;
  },
});

export const updateTaskAssignment = authMutation({
  args: { taskId: v.id("tasks"), userId: v.id("users") },
  handler: async ({ db }, args) => {
    const assignment = await db
      .query("taskAssignments")
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (assignment) {
      await db.patch(assignment._id, {
        userId: args.userId,
      });
    }
  },
});

export const getTaskAssignmentForDay = authQuery({
  args: {},
  handler: async (ctx, args) => {
    if (!ctx.user) return [];

    // Step 1: Query the taskAssignments table to get the tasks assigned to the user
    const userAssignments = await ctx.db
      .query("taskAssignments")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .collect();

    // Get the task IDs assigned to the user
    const userTaskIds = userAssignments.map((assignment) => assignment.taskId);

    // If no tasks are assigned to the user, return an empty array early
    if (userTaskIds.length === 0) return [];

    // Step 2: Get the current weekday number
    const getWeekdayNumber = () => {
      const date = new Date();
      const weekDay = date.getDay();
      return weekDay;
    };

    // Step 3: Query the tasks table to get tasks for the current weekday
    // We will filter the tasks by ID before collecting them
    const weekdayNumber = getWeekdayNumber();
    const weekdayTasksQuery = ctx.db
      .query("tasks")
      .withIndex("by_weekday", (q) => q.eq("weekday", weekdayNumber));

    // Collect tasks in chunks to avoid large bandwidth consumption
    let tasksForDay = [];
    for await (const task of weekdayTasksQuery) {
      if (userTaskIds.includes(task._id)) {
        tasksForDay.push(task);
      }
    }

    return tasksForDay;
  },
});

export const removeTaskAssignment = authMutation({
  args: { taskId: v.id("tasks"), userId: v.id("users") },
  handler: async ({ db }, args) => {
    const assignment = await db
      .query("taskAssignments")
      .filter((q) => q.eq(q.field("taskId"), args.taskId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (assignment) {
      await db.delete(assignment._id);
    }
  },
});

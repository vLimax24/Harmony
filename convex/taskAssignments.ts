import { v } from "convex/values";
import { authMutation, authQuery } from "./util";
import { Doc } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

export const assignTaskToMember = authMutation({
  args: { taskId: v.id("tasks"), userId: v.id("users"), teamId: v.id("teams") },
  handler: async ({ db }, args) => {
    const newAssignment = await db.insert("taskAssignments", {
      taskId: args.taskId,
      userId: args.userId,
      teamId: args.teamId,
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
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    if (!ctx.user) return [];

    const userAssignments = await ctx.db
      .query("taskAssignments")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();

    const userTaskIds = userAssignments.map((assignment) => assignment.taskId);

    const getWeekdayNumber = () => {
      const date = new Date();
      const weekDay = date.getDay();
      return weekDay === 0 ? 7 : weekDay;
    };

    const weekdayNumber = getWeekdayNumber();
    const weekdayTasksQuery = await ctx.db
      .query("tasks")
      .withIndex("by_weekday", (q) => q.eq("weekday", weekdayNumber))
      .collect();

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

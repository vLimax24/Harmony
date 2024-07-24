import { v } from "convex/values";
import { authMutation, authQuery } from "./util";

export const createTeam = authMutation({
  args: { name: v.string(), tasks: v.array(v.id("tasks")) },
  handler: async (ctx, args) => {
    const newTeam = await ctx.db.insert("teams", {
      name: args.name,
      tasks: args.tasks,
      owner: ctx.user._id,
    });
    return newTeam;
  },
});

export const updateTeamName = authMutation({
  args: { teamId: v.id("teams"), name: v.string() },
  handler: async ({ db }, args) => {
    await db.patch(args.teamId, { name: args.name });
  },
});

export const updateTeam = authMutation({
  args: {
    teamId: v.id("teams"),
    name: v.string(),
    tasks: v.array(v.id("tasks")),
  },
  handler: async ({ db }, args) => {
    await db.patch(args.teamId, { name: args.name, tasks: args.tasks });
  },
});

export const updateTeamTasks = authMutation({
  args: { teamId: v.id("teams"), tasks: v.array(v.id("tasks")) },
  handler: async ({ db }, args) => {
    await db.patch(args.teamId, { tasks: args.tasks });
  },
});

export const deleteTeam = authMutation({
  args: { teamId: v.id("teams") },
  handler: async ({ db }, args) => {
    await db.delete(args.teamId);
  },
});

export const getTeams = authQuery({
  args: {},
  handler: async ({ db }) => {
    const teams = await db.query("teams").collect();
    return teams;
  },
});

export const getMembersForTeam = authQuery({
  args: { userId: v.id("users"), teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const teamMembers = ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId));

    return teamMembers;
  },
});

export const getTeamsForUser = authQuery({
  args: {},
  handler: async (ctx) => {
    if (!ctx.user) return [];

    // Query teamMembers table to get the user's teams
    const teamMembers = await ctx.db
      .query("teamMembers")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .collect();

    // Extract team IDs from the teamMembers
    const teamIds = teamMembers.map((teamMember) => teamMember.teamId);

    // Use Promise.all to fetch all teams in parallel
    const teams = await Promise.all(
      teamIds.map(async (teamId) => {
        return ctx.db.get(teamId);
      })
    );

    return teams;
  },
});

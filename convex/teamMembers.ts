import { v } from "convex/values";
import { authMutation, authQuery } from "./util";

export const addTeamMember = authMutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const newTeamMember = await ctx.db.insert("teamMembers", {
      teamId: args.teamId,
      userId: ctx.user._id,
    });
    return newTeamMember;
  },
});

export const addOwnUserToTeam = authMutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const newTeamMember = await ctx.db.insert("teamMembers", {
      teamId: args.teamId,
      userId: ctx.user._id,
    });
    return newTeamMember;
  },
});

export const removeTeamMember = authMutation({
  args: { teamId: v.id("teams"), userId: v.id("users") },
  handler: async ({ db }, args) => {
    const teamMember = await db
      .query("teamMembers")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (teamMember) {
      await db.delete(teamMember._id);
    }
  },
});

export const getNumberOfMembersForTeam = authQuery({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const teamMembers = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .collect();

    return teamMembers.length;
  },
});

export const getNumberOfMembersForMultipleTeams = authQuery({
  args: { teamIds: v.array(v.id("teams")) },
  handler: async (ctx, args) => {
    const teams = await Promise.all(
      args.teamIds.map(async (teamId) => {
        const teamMembers = await ctx.db
          .query("teamMembers")
          .withIndex("by_teamId", (q) => q.eq("teamId", teamId))
          .collect();

        return { teamId, members: teamMembers.length };
      })
    );

    return teams;
  },
});

import { v } from "convex/values";
import { authMutation } from "./util";

export const addTeamMember = authMutation({
  args: { teamId: v.id("teams"), userId: v.id("users") },
  handler: async ({ db }, args) => {
    const newTeamMember = await db.insert("teamMembers", {
      teamId: args.teamId,
      userId: args.userId,
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

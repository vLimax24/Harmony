import { v } from "convex/values"
import { authMutation, authQuery } from "./util"

export const createTeam = authMutation({
  args: { name: v.string() },
  handler: async ({ db }, args) => {
    const newTeam = await db.insert("teams", { name: args.name })
    return newTeam
  },
})

export const updateTeamName = authMutation({
  args: { teamId: v.id("teams"), name: v.string() },
  handler: async ({ db }, args) => {
    await db.patch(args.teamId, { name: args.name })
  },
})

export const deleteTeam = authMutation({
  args: { teamId: v.id("teams") },
  handler: async ({ db }, args) => {
    await db.delete(args.teamId)
  },
})

export const getTeams = authQuery({
  args: {},
  handler: async ({ db }) => {
    const teams = await db.query("teams").collect()
    return teams
  },
})

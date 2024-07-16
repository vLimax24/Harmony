import { v } from "convex/values"
import { authMutation } from "./util"

export const assignTaskToMember = authMutation({
  args: { taskId: v.id("tasks"), userId: v.id("users") },
  handler: async ({ db }, args) => {
    const newAssignment = await db.insert("taskAssignments", {
      taskId: args.taskId,
      userId: args.userId,
    })
    return newAssignment
  },
})

export const removeTaskAssignment = authMutation({
  args: { taskId: v.id("tasks"), userId: v.id("users") },
  handler: async ({ db }, args) => {
    const assignment = await db.query("taskAssignments").filter(q =>
      q.eq(q.field("taskId"), args.taskId)).filter(q => q.eq(q.field("userId"), args.userId)
    ).first()
    
    if (assignment) {
      await db.delete(assignment._id)
    }
  },
})

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    clerkId: v.string(),
  })
    .searchIndex("search_username", {
      searchField: "username",
    })
    .index("by_clerkId", ["clerkId"]),
  teams: defineTable({
    name: v.string(),
    tasks: v.array(v.id("tasks")),
    owner: v.id("users"),
  }).index("by_owner", ["owner"]),
  tasks: defineTable({
    name: v.string(),
    frequency: v.number(),
    weekday: v.number(),
  }).index("by_weekday", ["weekday"]),
  teamMembers: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
  })
    .index("by_teamId", ["teamId"])
    .index("by_userId", ["userId"]),
  taskAssignments: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
  })
    .index("by_taskId", ["taskId"])
    .index("by_userId", ["userId"]),
  completedTasks: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
  })
    .index("by_taskId", ["taskId"])
    .index("by_userId", ["userId"]),
});

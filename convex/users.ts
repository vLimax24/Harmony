import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { authAction, authMutation, authQuery } from "./util";

export const getUserById = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .first();

    return user;
  },
});

export const getUser = authQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .first();
    return user;
  },
});

export const createUser = internalMutation({
  args: {
    email: v.any(),
    clerkId: v.string(),
    name: v.string(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) return;

    await ctx.db.insert("users", {
      email: args.email,
      clerkId: args.clerkId,
      profileImage: args.profileImage,
      name: args.name,
      notifications: false,
    });
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return;

    await ctx.db.delete(user._id);
  },
});

export const updateUser = internalMutation({
  args: { clerkId: v.string(), name: v.string(), profileImage: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new ConvexError("user not found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      profileImage: args.profileImage,
    });
  },
});

export const updateUsername = authMutation({
  args: { username: v.string() },
  handler: async ({ db, user }, { username }) => {
    await db.patch(user._id, { username: username });
  },
});

export const getMyUser = authQuery({
  args: {},
  handler: async (ctx) => ctx.user,
});

export const getMyUserId = authQuery({
  args: {},
  handler: async (ctx) => ctx?.user?._id,
});
export const searchUsers = authQuery({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!ctx.auth) throw new ConvexError("Not Authorized");
    const users = await ctx.db
      .query("users")
      .withSearchIndex("search_username", (q) =>
        q.search("username", args.searchTerm)
      )
      .take(2);
    return users;
  },
});

export const updateNotifications = authMutation({
  args: { notifications: v.boolean() },
  handler: async ({ db, user }, { notifications }) => {
    await db.patch(user._id, { notifications: notifications });
  },
});

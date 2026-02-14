import client from "./client";
import { Reaction } from "@/types/types";

export const getReactionForPost = (postId: string) =>
  client.get(`/posts/${postId}/reactions`);

export const toggleReactionForPost = (postId: string, reactionType: string) =>
  client.post(`/posts/${postId}/reactions`, { type: reactionType });

export const getReactionForComment = (commentId: string) =>
  client.get(`/comments/${commentId}/reactions`);

export const toggleReactionForComment = (
  commentId: string,
  reactionType: string,
) => client.post(`/comments/${commentId}/reactions`, { type: reactionType });

export const getCurrentUserReaction = (
  reactions: Reaction[],
  userId: string,
): string | null => {
  const userReaction = reactions.find((r: Reaction) => {
    const rUserId = typeof r.userId === "string" ? r.userId : r.userId._id;
    return rUserId === userId;
  });
  return userReaction ? userReaction.reactionType : null;
};

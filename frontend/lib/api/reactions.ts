import client from "./client";

export const getReactionForPost = (postId: string) => client.get(`/posts/${postId}/reactions`);

export const toggleReactionForPost = (postId: string, reactionType: string) => client.post(`/posts/${postId}/reactions`, { type: reactionType });

export const getReactionForComment = (commentId: string) => client.get(`/comments/${commentId}/reactions`);

export const toggleReactionForComment = (commentId: string, reactionType: string) => client.post(`/comments/${commentId}/reactions`, { type: reactionType });
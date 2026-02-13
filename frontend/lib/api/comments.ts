import client from "./client";

export const createComment = ({postId, content}: { postId: string, content: string }) => client.post(`/posts/${postId}/comments`, { content });

export const getCommentsForPost = (postId: string) => client.get(`/posts/${postId}/comments`);

export const deleteComment = (commentId: string) => client.delete(`/comments/${commentId}`);
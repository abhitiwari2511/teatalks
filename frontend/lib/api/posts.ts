import { PostPayload } from "@/types/types";
import client from "./client";

export const getAllPosts = (page: number = 1, limit: number = 10) =>
  client.get("/posts", { params: { page, limit } });
export const getPostById = (postId: string) => client.get(`/posts/${postId}`);
export const createPost = (data: PostPayload) => client.post("/posts", data);
export const updatePost = (postId: string, data: PostPayload) =>
  client.put(`/posts/${postId}`, data);
export const deletePost = (postId: string) => client.delete(`/posts/${postId}`);

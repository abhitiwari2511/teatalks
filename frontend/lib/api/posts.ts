import { PostPayload } from "@/types/types";
import client from "./client";

export const getAllPosts = () => client.get("/posts");
export const getPostById = (postId: string) => client.get(`/posts/${postId}`);
export const createPost = (data: PostPayload) => client.post("/posts", data);
export const updatePost = (postId: string, data: PostPayload) =>
  client.put(`/posts/${postId}`, data);
export const deletePost = (postId: string) => client.delete(`/posts/${postId}`);

import { PostPayload, Post, PaginatedPostsResponse } from "@/types/types";
import client from "./client";

interface ApiResponse<T> {
  data: T;
}

interface AxiosResponseData<T> {
  data: T;
}

export const getAllPosts = async (
  page: number = 1,
  limit: number = 10,
): Promise<AxiosResponseData<PaginatedPostsResponse>> =>
  client.get("/posts", { params: { page, limit } });

export const getPostById = async (
  postId: string,
): Promise<AxiosResponseData<ApiResponse<Post>>> =>
  client.get(`/posts/${postId}`);

export const createPost = async (
  data: PostPayload,
): Promise<AxiosResponseData<ApiResponse<Post>>> => client.post("/posts", data);

export const updatePost = async (
  postId: string,
  data: PostPayload,
): Promise<AxiosResponseData<ApiResponse<Post>>> =>
  client.put(`/posts/${postId}`, data);

export const deletePost = async (
  postId: string,
): Promise<AxiosResponseData<void>> => client.delete(`/posts/${postId}`);

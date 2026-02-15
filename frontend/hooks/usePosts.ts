import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "@/lib/api/posts";
import { Post, PostPayload } from "@/types/types";
import { useState } from "react";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    totalPages: number;
    totalPosts: number;
  } | null>(null);

  const fetchPosts = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPosts(page, limit);
      setPosts(response.data.data);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalPosts: response.data.totalPosts,
      });
    } catch (error) {
      console.log("failed to fetch posts" + error)
    } finally {
      setLoading(false);
    }
  };

  const fetchPostById = async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostById(postId);
      setCurrentPost(response.data.data);
    } catch (error) {
       console.log("failed to fetch specific post" + error)
    } finally {
      setLoading(false);
    }
  };

  const createUserPost = async (data: PostPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPost(data);
      setPosts((prevPosts) => [...prevPosts, response.data.data]);
    } catch (error) {
        console.log("failed to create post" + error)
    } finally {
      setLoading(false);
    }
  };

  const updateUserPost = async (postId: string, data: PostPayload) => {
    setLoading(true);
    setError(null);
    try {
        const response = await updatePost(postId, data);
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? response.data.data : post))
        );
    } catch (error) {
        console.log("failed to update the post" + error)
    } finally {
        setLoading(false);
    }
  };

  const deleteUserPost = async (postId: string) => {
    setLoading(true);
    setError(null);
    try {
        await deletePost(postId);
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
        console.log("failed to delete the post" + error);
    } finally {
        setLoading(false);
    }
  };

  return {
    posts,
    currentPost,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchPostById,
    createUserPost,
    updateUserPost,
    deleteUserPost,
  };
};

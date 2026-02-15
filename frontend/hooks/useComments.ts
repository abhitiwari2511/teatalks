import { Comment } from "@/types/types";
import {
  createComment,
  deleteComment,
  getCommentsForPost as fetchCommentsForPost,
} from "../lib/api/comments";

export const useComments = () => {
  const createPostComment = async (postId: string, content: string) => {
    try {
      const response = await createComment({ postId, content });
      const data = response.data as { data: any };
      return data.data;
    } catch (error) {
      console.log("Error while creating the comment", error);
      throw error;
    }
  };

  const deletePostComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.log("Error while deleting the comment", error);
      throw error;
    }
  };

  const getCommentsForPost = async (postId: string) => {
    try {
      const response = await fetchCommentsForPost(postId);
      return response.data as any;
    } catch (error) {
      console.log("Error while fetching comments for the post", error);
      throw error;
    }
  };

  return {
    createPostComment,
    deletePostComment,
    getCommentsForPost,
  };
};

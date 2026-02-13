import {
  createComment,
  deleteComment,
  getCommentsForPost as fetchCommentsForPost,
} from "../lib/api/comments";

export const useComments = () => {
  const createPostComment = async (postId: string, content: string) => {
    try {
      await createComment({ postId, content });
    } catch (error) {
      console.log("Error while creating the comment", error);
    }
  };

  const deletePostComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.log("Error while deleting the comment", error);
    }
  };

  const getCommentsForPost = async (postId: string) => {
    try {
      const response = await fetchCommentsForPost(postId);
      return response.data;
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

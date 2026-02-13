import { 
  getReactionForPost, 
  toggleReactionForPost,
  getReactionForComment,
  toggleReactionForComment 
} from "@/lib/api/reactions";

export const useReactions = () => {
  const getPostReactions = async (postId: string) => {
    try {
      const response = await getReactionForPost(postId);
      return response.data;
    } catch (error) {
      console.log("Error while fetching post reactions", error);
      throw error;
    }
  };

  const togglePostReaction = async (postId: string, reactionType: string) => {
    try {
      const response = await toggleReactionForPost(postId, reactionType);
      return response.data;
    } catch (error) {
      console.log("Error while toggling post reaction", error);
      throw error;
    }
  };

  const getCommentReactions = async (commentId: string) => {
    try {
      const response = await getReactionForComment(commentId);
      return response.data;
    } catch (error) {
      console.log("Error while fetching comment reactions", error);
      throw error;
    }
  };

  const toggleCommentReaction = async (commentId: string, reactionType: string) => {
    try {
      const response = await toggleReactionForComment(commentId, reactionType);
      return response.data;
    } catch (error) {
      console.log("Error while toggling comment reaction", error);
      throw error;
    }
  };

  return {
    getPostReactions,
    togglePostReaction,
    getCommentReactions,
    toggleCommentReaction,
  };
};
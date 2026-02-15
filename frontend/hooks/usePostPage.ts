import { useState, useEffect } from "react";
import { Post, Comment } from "@/types/types";
import { useReactions } from "./useReactions";
import { useComments } from "./useComments";
import { usePosts } from "./usePosts";

type ReactionType = "like" | "love" | "funny" | "angry";

export function usePostPage(postId: string, userId?: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [userCommentReactions, setUserCommentReactions] = useState<
    Record<string, string | null>
  >({});
  const [localReactionCount, setLocalReactionCount] = useState({
    like: 0,
    love: 0,
    funny: 0,
    angry: 0,
  });

  const {
    togglePostReaction,
    toggleCommentReaction,
    getPostReactions,
    getCommentReactions,
  } = useReactions();
  const { createPostComment, deletePostComment, getCommentsForPost } =
    useComments();
  const { fetchPostById, currentPost, deleteUserPost } = usePosts();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);

        await fetchPostById(postId);

        if (userId) {
          try {
            const reactionsData = (await getPostReactions(postId)) as {
              success: boolean;
              data: {
                reactions: Array<{
                  userId: { _id: string } | string;
                  reactionType: string;
                }>;
              };
            };
            if (reactionsData.success && reactionsData.data.reactions) {
              const currentUserReaction = reactionsData.data.reactions.find(
                (r: {
                  userId: { _id: string } | string;
                  reactionType: string;
                }) =>
                  (typeof r.userId === "object" ? r.userId._id : r.userId) ===
                  userId,
              );
              if (currentUserReaction) {
                setUserReaction(currentUserReaction.reactionType);
              }
            }
          } catch (error) {
            console.error("Failed to fetch reactions:", error);
          }
        }

        const commentsData = await getCommentsForPost(postId);
        const fetchedComments = commentsData.data || [];
        setComments(fetchedComments);

        if (userId && fetchedComments.length > 0) {
          const commentReactionsMap: Record<string, string | null> = {};

          for (const comment of fetchedComments) {
            try {
              const commentReactionsData = (await getCommentReactions(
                comment._id,
              )) as {
                success: boolean;
                data: {
                  reactions: Array<{
                    userId: { _id: string } | string;
                    reactionType: string;
                  }>;
                };
              };
              if (
                commentReactionsData.success &&
                commentReactionsData.data.reactions
              ) {
                const userCommentReaction =
                  commentReactionsData.data.reactions.find(
                    (r: {
                      userId: { _id: string } | string;
                      reactionType: string;
                    }) =>
                      (typeof r.userId === "object"
                        ? r.userId._id
                        : r.userId) === userId,
                  );
                commentReactionsMap[comment._id] =
                  userCommentReaction?.reactionType || null;
              } else {
                commentReactionsMap[comment._id] = null;
              }
            } catch {
              commentReactionsMap[comment._id] = null;
            }
          }

          setUserCommentReactions(commentReactionsMap);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, userId]);

  useEffect(() => {
    if (currentPost) {
      setPost(currentPost);
      setLocalReactionCount(
        currentPost.reactionCount || { like: 0, love: 0, funny: 0, angry: 0 },
      );
    }
  }, [currentPost]);

  const handleReactionClick = async (reactionType: string) => {
    if (!post) return;

    const oldReaction = userReaction;

    try {
      await togglePostReaction(post._id, reactionType as ReactionType);

      setLocalReactionCount((prev) => {
        const newCount = { ...prev };
        const reactionKey = reactionType as ReactionType;

        if (oldReaction === reactionType) {
          newCount[reactionKey] = Math.max(0, newCount[reactionKey] - 1);
          setUserReaction(null);
        } else if (oldReaction) {
          newCount[oldReaction as ReactionType] = Math.max(
            0,
            newCount[oldReaction as ReactionType] - 1,
          );
          newCount[reactionKey] = (newCount[reactionKey] || 0) + 1;
          setUserReaction(reactionType);
        } else {
          newCount[reactionKey] = (newCount[reactionKey] || 0) + 1;
          setUserReaction(reactionType);
        }

        return newCount;
      });
    } catch (error) {
      console.error("Error toggling reaction:", error);
      setUserReaction(oldReaction);
    }
  };

  const handleCommentReactionClick = async (
    commentId: string,
    reactionType: "like" | "love",
  ) => {
    const oldReaction = userCommentReactions[commentId];

    try {
      await toggleCommentReaction(commentId, reactionType);

      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === commentId) {
            const newCount = { ...comment.reactionCount };

            if (oldReaction === reactionType) {
              newCount[reactionType] = Math.max(
                0,
                (newCount[reactionType] || 0) - 1,
              );
              setUserCommentReactions((prev) => ({
                ...prev,
                [commentId]: null,
              }));
            } else if (oldReaction) {
              newCount[oldReaction as "like" | "love"] = Math.max(
                0,
                (newCount[oldReaction as "like" | "love"] || 0) - 1,
              );
              newCount[reactionType] = (newCount[reactionType] || 0) + 1;
              setUserCommentReactions((prev) => ({
                ...prev,
                [commentId]: reactionType,
              }));
            } else {
              newCount[reactionType] = (newCount[reactionType] || 0) + 1;
              setUserCommentReactions((prev) => ({
                ...prev,
                [commentId]: reactionType,
              }));
            }

            return {
              ...comment,
              reactionCount: {
                like: newCount.like || 0,
                love: newCount.love || 0,
              },
            };
          }
          return comment;
        }),
      );
    } catch (error) {
      console.error("Error toggling comment reaction:", error);
      setUserCommentReactions((prev) => ({
        ...prev,
        [commentId]: oldReaction,
      }));
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !post) return;

    setIsSubmitting(true);
    try {
      const newComment = await createPostComment(post._id, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");

      setPost((prevPost) =>
        prevPost
          ? { ...prevPost, commentCount: (prevPost.commentCount || 0) + 1 }
          : null,
      );
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deletePostComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));

      setPost((prevPost) =>
        prevPost
          ? {
              ...prevPost,
              commentCount: Math.max(0, (prevPost.commentCount || 0) - 1),
            }
          : null,
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteUserPost(postId);
      return true;
    } catch (error) {
      console.error("Failed to delete post:", error);
      return false;
    }
  };

  return {
    post,
    comments,
    loading,
    commentText,
    isSubmitting,
    userReaction,
    userCommentReactions,
    localReactionCount,
    setCommentText,
    handleReactionClick,
    handleCommentReactionClick,
    handleSubmitComment,
    handleDeleteComment,
    handleDeletePost,
  };
}

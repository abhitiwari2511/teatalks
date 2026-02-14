"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post, Comment } from "@/types/types";
import { useAuth } from "@/hooks/useAuth";
import { useReactions } from "@/hooks/useReactions";
import { useComments } from "@/hooks/useComments";
import { usePosts } from "@/hooks/usePosts";
import Header from "@/components/homePage/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const reactionEmojis = {
  like: "👍",
  love: "💝",
  funny: "😂",
  angry: "😡",
};

const commentReactionEmojis = {
  like: "👍",
  love: "💝",
};

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null); // Track user's current reaction

  const { togglePostReaction, toggleCommentReaction, getPostReactions } =
    useReactions();
  const { createPostComment, deletePostComment, getCommentsForPost } =
    useComments();
  const { fetchPostById, currentPost } = usePosts();

  // Local state for reactions
  const [localReactionCount, setLocalReactionCount] = useState(
    post?.reactionCount || { like: 0, love: 0, funny: 0, angry: 0 },
  );

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);

        // Fetch post using the hook
        await fetchPostById(postId);

        // Fetch reactions to determine user's current reaction
        if (user) {
          try {
            const reactionsData = await getPostReactions(postId);
            if (reactionsData.success && reactionsData.data.reactions) {
              const currentUserReaction = reactionsData.data.reactions.find(
                (r: {
                  userId: { _id: string } | string;
                  reactionType: string;
                }) =>
                  (typeof r.userId === "object" ? r.userId._id : r.userId) ===
                  user._id,
              );
              if (currentUserReaction) {
                setUserReaction(currentUserReaction.reactionType);
              }
            }
          } catch (error) {
            console.error("Failed to fetch reactions:", error);
          }
        }

        // Fetch comments
        const commentsData = await getCommentsForPost(postId);
        setComments(commentsData.data || []);
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
  }, [postId, user?._id]);

  // Update local post state when currentPost from hook changes
  useEffect(() => {
    if (currentPost) {
      setPost(currentPost);
      setLocalReactionCount(
        currentPost.reactionCount || { like: 0, love: 0, funny: 0, angry: 0 },
      );
    }
  }, [currentPost]);

  const handleReactionClick = async (
    reactionType: keyof typeof reactionEmojis,
  ) => {
    if (!post) return;

    const oldReaction = userReaction;

    try {
      await togglePostReaction(post._id, reactionType);

      // Update local counts based on the reaction change
      setLocalReactionCount((prev) => {
        const newCount = { ...prev };

        // If user clicked their current reaction, remove it
        if (oldReaction === reactionType) {
          newCount[reactionType] = Math.max(0, newCount[reactionType] - 1);
          setUserReaction(null);
        }
        // If user is switching reactions
        else if (oldReaction) {
          // Decrement old reaction
          newCount[oldReaction as keyof typeof reactionEmojis] = Math.max(
            0,
            newCount[oldReaction as keyof typeof reactionEmojis] - 1,
          );
          // Increment new reaction
          newCount[reactionType] = (newCount[reactionType] || 0) + 1;
          setUserReaction(reactionType);
        }
        // If user had no reaction, add new one
        else {
          newCount[reactionType] = (newCount[reactionType] || 0) + 1;
          setUserReaction(reactionType);
        }

        return newCount;
      });
    } catch (error) {
      console.error("Error toggling reaction:", error);
      // Revert on error
      setUserReaction(oldReaction);
    }
  };

  const handleCommentReactionClick = async (
    commentId: string,
    reactionType: "like" | "love",
  ) => {
    try {
      await toggleCommentReaction(commentId, reactionType);

      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === commentId) {
            const newCount = { ...comment.reactionCount };
            const currentCount = newCount[reactionType] || 0;
            if (currentCount > 0) {
              newCount[reactionType] = Math.max(0, currentCount - 1);
            } else {
              newCount[reactionType] = currentCount + 1;
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
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !post) return;

    setIsSubmitting(true);
    try {
      const newComment = await createPostComment(post._id, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");

      // Update post comment count
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

      // Update post comment count
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

  const formatDate = (dateString: string) => {
    const postDate = new Date(dateString);
    return postDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background dark">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold mb-2">Post not found</h2>
            <Button onClick={() => router.push("/home")} className="mt-4">
              Go back home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalReactions = Object.values(localReactionCount).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left Side - Post Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFF8DC] border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Author info */}
              <div className="flex items-center justify-between mb-6">
                <div
                  onClick={() => {
                    if (typeof post.authorId !== "string") {
                      router.push(`/profile/${post.authorId.userName}`);
                    }
                  }}
                  className="cursor-pointer hover:underline"
                >
                  <div className="text-2xl font-black text-black">
                    {typeof post.authorId === "string"
                      ? "Unknown"
                      : post.authorId.userName}
                  </div>
                </div>
                <div className="text-sm text-black/70 font-normal">
                  📅 {formatDate(post.createdAt)}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-black text-black mb-4 wrap-break-word">
                {post.title}
              </h1>

              {/* Content */}
              <div className="text-black font-normal text-lg whitespace-pre-wrap wrap-break-word">
                {post.content}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Reactions & Comments */}
          <div className="lg:col-span-1 space-y-6">
            {/* Reactions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#B4E7E7] border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👍</span>
                <h3 className="text-xl font-black text-black">Like</h3>
                <span className="ml-auto text-2xl font-black text-black">
                  {totalReactions}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(
                  Object.entries(reactionEmojis) as [
                    keyof typeof reactionEmojis,
                    string,
                  ][]
                ).map(([type, emoji]) => {
                  const isSelected = userReaction === type;
                  return (
                    <button
                      key={type}
                      onClick={() => handleReactionClick(type)}
                      className={`flex items-center justify-center gap-2 border-4 border-black rounded-xl p-3 hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                        isSelected ? "bg-[#FF9B7C] scale-105" : "bg-white"
                      }`}
                    >
                      <span className="text-3xl">{emoji}</span>
                      <span className="text-lg font-bold text-black">
                        {localReactionCount[type] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Comments Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#FFB5D5] border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💬</span>
                <h3 className="text-xl font-black text-black">Comments</h3>
                <span className="ml-auto text-lg font-black text-black">
                  {comments.length}
                </span>
              </div>

              {/* Comment input */}
              <div className="mb-4">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Drop your best roast (be kind) ..."
                  className="border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none bg-white"
                  rows={3}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !commentText.trim()}
                  className="mt-2 w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold bg-[#FF9B7C]"
                >
                  Post
                </Button>
              </div>

              {/* Comments list */}
              <div className="space-y-3 max-h-125 overflow-y-auto">
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#FF9B7C] border-2 border-black rounded-full flex items-center justify-center font-bold text-black">
                            {typeof comment.authorId !== "string"
                              ? comment.authorId.userName[0].toUpperCase()
                              : "?"}
                          </div>
                          <div>
                            <div className="font-bold text-black text-sm">
                              {typeof comment.authorId !== "string"
                                ? comment.authorId.userName
                                : "Unknown"}
                            </div>
                            <div className="text-xs text-black/60">
                              {formatDate(comment.createdAt)}
                            </div>
                          </div>
                        </div>
                        {user &&
                          typeof comment.authorId !== "string" &&
                          comment.authorId._id === user._id && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-black/60 hover:text-black transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                      </div>

                      <p className="text-black font-normal text-sm mb-3 wrap-break-word">
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-2">
                        {(
                          Object.entries(commentReactionEmojis) as [
                            "like" | "love",
                            string,
                          ][]
                        ).map(([type, emoji]) => (
                          <button
                            key={type}
                            onClick={() =>
                              handleCommentReactionClick(comment._id, type)
                            }
                            className="flex items-center gap-1 bg-background/50 border-2 border-black rounded-full px-2 py-1 hover:scale-110 transition-transform"
                          >
                            <span className="text-sm">{emoji}</span>
                            <span className="text-xs font-bold text-black">
                              {comment.reactionCount?.[type] || 0}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {comments.length === 0 && (
                  <div className="text-center py-8 text-black/60">
                    No comments yet. Be the first! 🚀
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

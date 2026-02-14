"use client";

import { Comment } from "@/types/types";
import { useState, useEffect, useCallback } from "react";
import { useComments } from "@/hooks/useComments";
import { useReactions } from "@/hooks/useReactions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Trash2, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommentSectionProps {
  postId: string;
  onClose?: () => void;
}

const reactionEmojis = {
  like: "👍",
  love: "💝",
};

export default function CommentSection({
  postId,
  onClose,
}: CommentSectionProps) {
  const { user } = useAuth();
  const { getCommentsForPost, createPostComment, deletePostComment } =
    useComments();
  const { toggleCommentReaction } = useReactions();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCommentsForPost(postId);
      setComments(response.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      await createPostComment(postId, newComment.trim());
      setNewComment("");
      await fetchComments(); 
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      await deletePostComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReactionClick = async (
    commentId: string,
    reactionType: keyof typeof reactionEmojis,
  ) => {
    try {
      await toggleCommentReaction(commentId, reactionType);

      // Update local state
      setComments((prev) =>
        prev.map((comment) => {
          if (comment._id === commentId && comment.reactionCount) {
            const newCount = { ...comment.reactionCount };
            if (newCount[reactionType] > 0) {
              newCount[reactionType] = Math.max(0, newCount[reactionType] - 1);
            } else {
              newCount[reactionType] = (newCount[reactionType] || 0) + 1;
            }
            return { ...comment, reactionCount: newCount };
          }
          return comment;
        }),
      );
    } catch (error) {
      console.error("Error toggling comment reaction:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t-4 border-border mt-4 pt-4"
    >
      {/* Comment Input */}
      <div className="mb-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2 border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleSubmitComment();
            }
          }}
        />
        <div className="flex gap-2 justify-end">
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Close
            </Button>
          )}
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            className="bg-primary text-primary-foreground border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-primary disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-1" />
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-4xl mb-2">💬</p>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background border-2 border-border rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-foreground">
                      @
                      {typeof comment.authorId === "string"
                        ? "Unknown"
                        : comment.authorId.userName}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  {user &&
                    typeof comment.authorId !== "string" &&
                    comment.authorId._id === user._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                </div>

                <p className="text-foreground mb-2 whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Comment Reactions */}
                <div className="flex items-center gap-2">
                  {comment.reactionCount &&
                    Object.values(comment.reactionCount).some(
                      (count) => count > 0,
                    ) && (
                      <div className="flex items-center gap-1 mr-2">
                        {(
                          Object.entries(comment.reactionCount) as [
                            keyof typeof reactionEmojis,
                            number,
                          ][]
                        ).map(
                          ([type, count]) =>
                            count > 0 && (
                              <button
                                key={type}
                                onClick={() =>
                                  handleReactionClick(comment._id, type)
                                }
                                className="text-sm bg-card border border-border rounded-full px-2 py-0.5 hover:scale-110 transition-transform"
                              >
                                {reactionEmojis[type]} {count}
                              </button>
                            ),
                        )}
                      </div>
                    )}

                  {/* Reaction Buttons */}
                  {(
                    Object.entries(reactionEmojis) as [
                      keyof typeof reactionEmojis,
                      string,
                    ][]
                  ).map(([type, emoji]) => (
                    <button
                      key={type}
                      onClick={() => handleReactionClick(comment._id, type)}
                      className="text-lg hover:scale-125 transition-transform p-1"
                      title={type}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

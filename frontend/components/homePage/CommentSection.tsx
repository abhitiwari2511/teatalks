"use client";

import { Comment } from "@/types/types";
import { useState, useEffect, useCallback } from "react";
import { useComments } from "@/hooks/useComments";
import { useReactions } from "@/hooks/useReactions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Trash2, Send, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommentSectionProps {
  postId: string;
  onClose?: () => void;
}

const reactionEmojis = {
  like: "👍",
  love: "💝",
};

function CommentRow({
  comment,
  user,
  replyingToId,
  replyText,
  isReplySubmitting,
  isReply,
  onDelete,
  onReaction,
  onStartReply,
  onCancelReply,
  onReplyTextChange,
  onSubmitReply,
  formatDate,
}: {
  comment: Comment;
  user: { _id: string } | null;
  replyingToId: string | null;
  replyText: string;
  isReplySubmitting: boolean;
  isReply?: boolean;
  onDelete: (id: string) => void;
  onReaction: (id: string, type: keyof typeof reactionEmojis) => void;
  onStartReply: (id: string) => void;
  onCancelReply: () => void;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: (id: string) => void;
  formatDate: (date: string) => string;
}) {
  const isReplying = replyingToId === comment._id;
  const isOwn =
    user &&
    typeof comment.authorId !== "string" &&
    comment.authorId._id === user._id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-background border-2 border-border rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isReply ? "border border-border shadow-none" : ""}`}
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
        {isOwn && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-foreground mb-2 whitespace-pre-wrap">
        {comment.content}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {(
          Object.entries(reactionEmojis) as [
            keyof typeof reactionEmojis,
            string,
          ][]
        ).map(([type, emoji]) => (
          <button
            key={type}
            onClick={() => onReaction(comment._id, type)}
            className="text-sm bg-card border border-border rounded-full px-2 py-0.5 hover:scale-110 transition-transform"
          >
            {emoji} {comment.reactionCount?.[type] || 0}
          </button>
        ))}

        {!isReply && (
          <button
            onClick={() =>
              isReplying ? onCancelReply() : onStartReply(comment._id)
            }
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto border border-border rounded-full px-2 py-0.5"
          >
            {isReplying ? (
              <X className="w-3 h-3" />
            ) : (
              <MessageSquare className="w-3 h-3" />
            )}
            {isReplying ? "Cancel" : "Reply"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              className="mb-2 border-2 border-border rounded-xl resize-none text-sm"
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) onSubmitReply(comment._id);
                if (e.key === "Escape") onCancelReply();
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelReply}
                className="border-2 border-border rounded-full text-xs h-7"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => onSubmitReply(comment._id)}
                disabled={isReplySubmitting || !replyText.trim()}
                className="border-2 border-border rounded-full text-xs h-7"
              >
                <Send className="w-3 h-3 mr-1" />
                {isReplySubmitting ? "Posting..." : "Reply"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isReply && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-4 pl-3 border-l-2 border-border space-y-2">
          <AnimatePresence>
            {comment.replies.map((reply) => (
              <CommentRow
                key={reply._id}
                comment={reply}
                user={user}
                replyingToId={replyingToId}
                replyText={replyText}
                isReplySubmitting={isReplySubmitting}
                isReply
                onDelete={onDelete}
                onReaction={onReaction}
                onStartReply={onStartReply}
                onCancelReply={onCancelReply}
                onReplyTextChange={onReplyTextChange}
                onSubmitReply={onSubmitReply}
                formatDate={formatDate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default function CommentSection({
  postId,
  onClose,
}: CommentSectionProps) {
  const { user } = useAuth();
  const {
    getCommentsForPost,
    createPostComment,
    deletePostComment,
    replyComment,
  } = useComments();
  const { toggleCommentReaction } = useReactions();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCommentsForPost(postId);
      setComments((response as { data: Comment[] }).data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, getCommentsForPost]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;
    try {
      setSubmitting(true);
      const created = await createPostComment(postId, newComment.trim());
      const commentWithReplies = {
        ...(created as unknown as Comment),
        replies: [],
      };
      setComments((prev) => [commentWithReplies, ...prev]);
      setNewComment("");
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
      setComments((prev) => {
        const isTopLevel = prev.some((c) => c._id === commentId);
        if (isTopLevel) return prev.filter((c) => c._id !== commentId);
        return prev.map((c) => ({
          ...c,
          replies: (c.replies || []).filter((r) => r._id !== commentId),
        }));
      });
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
      const updateCount = (c: Comment) => {
        if (c._id !== commentId || !c.reactionCount) return c;
        const newCount = { ...c.reactionCount };
        newCount[reactionType] =
          newCount[reactionType] > 0
            ? Math.max(0, newCount[reactionType] - 1)
            : (newCount[reactionType] || 0) + 1;
        return { ...c, reactionCount: newCount };
      };
      setComments((prev) =>
        prev.map((c) => ({
          ...updateCount(c),
          replies: (c.replies || []).map(updateCount),
        })),
      );
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  const handleStartReply = useCallback((commentId: string) => {
    setReplyingToId(commentId);
    setReplyText("");
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingToId(null);
    setReplyText("");
  }, []);

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    setIsReplySubmitting(true);
    try {
      const response = await replyComment(commentId, replyText.trim());
      const newReply = response.data as Comment;
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c,
        ),
      );
      setReplyingToId(null);
      setReplyText("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsReplySubmitting(false);
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
      <div className="mb-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2 border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) handleSubmitComment();
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
              >
                <CommentRow
                  comment={comment}
                  user={user}
                  replyingToId={replyingToId}
                  replyText={replyText}
                  isReplySubmitting={isReplySubmitting}
                  onDelete={handleDeleteComment}
                  onReaction={handleReactionClick}
                  onStartReply={handleStartReply}
                  onCancelReply={handleCancelReply}
                  onReplyTextChange={setReplyText}
                  onSubmitReply={handleSubmitReply}
                  formatDate={formatDate}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

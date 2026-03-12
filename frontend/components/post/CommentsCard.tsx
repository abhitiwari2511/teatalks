"use client";

import { Comment, CommentsCardProps } from "@/types/types";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Trash2,
  MessageSquare,
  X,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

function CommentItem({
  comment,
  userId,
  commentReactionEmojis,
  userCommentReactions,
  replyingToId,
  replyText,
  isReplySubmitting,
  isReply,
  onDeleteComment,
  onCommentReactionClick,
  onReplyTextChange,
  onStartReply,
  onCancelReply,
  onSubmitReply,
  formatDate,
}: {
  comment: Comment;
  userId: string | undefined;
  commentReactionEmojis: Record<string, string>;
  userCommentReactions: Record<string, string | null>;
  replyingToId: string | null;
  replyText: string;
  isReplySubmitting: boolean;
  isReply?: boolean;
  onDeleteComment: (id: string) => void;
  onCommentReactionClick: (id: string, type: "like" | "love") => void;
  onReplyTextChange: (text: string) => void;
  onStartReply: (id: string) => void;
  onCancelReply: () => void;
  onSubmitReply: (id: string) => void;
  formatDate: (date: string) => string;
}) {
  const isOwnComment =
    userId &&
    typeof comment.authorId !== "string" &&
    comment.authorId._id === userId;
  const userReaction = userCommentReactions[comment._id];
  const isReplying = replyingToId === comment._id;
  const [showReplies, setShowReplies] = useState(false);
  const replyCount = comment.replies?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isReply ? "border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 border-2 border-black rounded-full flex items-center justify-center font-bold text-black ${isReply ? "bg-[#B5D5FF]" : "bg-[#FF9B7C]"}`}
          >
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
        {isOwnComment && (
          <button
            onClick={() => onDeleteComment(comment._id)}
            className="text-black/60 cursor-pointer hover:text-black transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-black font-normal text-sm mb-3 wrap-break-word">
        {comment.content}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        {(
          Object.entries(commentReactionEmojis) as ["like" | "love", string][]
        ).map(([type, emoji]) => {
          const isSelected = userReaction === type;
          return (
            <button
              key={type}
              onClick={() => onCommentReactionClick(comment._id, type)}
              className={`flex items-center gap-1 border-2 border-black rounded-full px-2 py-1 hover:scale-110 transition-all ${
                isSelected ? "bg-[#FF9B7C] scale-105" : "bg-background/50"
              }`}
            >
              <span className="text-sm">{emoji}</span>
              <span className="text-xs font-bold text-black">
                {comment.reactionCount?.[type] || 0}
              </span>
            </button>
          );
        })}

        {!isReply && (
          <button
            onClick={() =>
              isReplying ? onCancelReply() : onStartReply(comment._id)
            }
            className="flex items-center gap-1 border-2 border-black rounded-full px-2 py-1 hover:scale-110 transition-all bg-background/50 ml-auto"
          >
            {isReplying ? (
              <X className="w-3 h-3" />
            ) : (
              <MessageSquare className="w-3 h-3" />
            )}
            <span className="text-xs font-bold text-black">
              {isReplying ? "Cancel" : "Reply"}
            </span>
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
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              placeholder="Write a reply..."
              className="border-2 border-black rounded-xl resize-none bg-[#FFF9F0] text-sm"
              rows={1}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  onSubmitReply(comment._id);
                }
                if (e.key === "Escape") {
                  onCancelReply();
                }
              }}
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancelReply}
                className="border-2 border-black rounded-full text-xs h-7"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => onSubmitReply(comment._id)}
                disabled={isReplySubmitting || !replyText.trim()}
                className="border-2 border-black rounded-full text-xs h-7 bg-[#FF9B7C] font-bold"
              >
                <Send className="w-3 h-3 mr-1" />
                {isReplySubmitting ? "Posting..." : "Reply"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isReply && replyCount > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-black/60 hover:text-black transition-colors"
          >
            {showReplies ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
            {showReplies ? "Hide" : "Show"} {replyCount}{" "}
            {replyCount === 1 ? "reply" : "replies"}
          </button>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 ml-4 space-y-2 border-l-4 border-black pl-3 overflow-hidden"
              >
                {comment.replies!.map((reply) => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    userId={userId}
                    commentReactionEmojis={commentReactionEmojis}
                    userCommentReactions={userCommentReactions}
                    replyingToId={replyingToId}
                    replyText={replyText}
                    isReplySubmitting={isReplySubmitting}
                    isReply
                    onDeleteComment={onDeleteComment}
                    onCommentReactionClick={onCommentReactionClick}
                    onReplyTextChange={onReplyTextChange}
                    onStartReply={onStartReply}
                    onCancelReply={onCancelReply}
                    onSubmitReply={onSubmitReply}
                    formatDate={formatDate}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default function CommentsCard({
  comments,
  commentText,
  isSubmitting,
  userId,
  commentReactionEmojis,
  userCommentReactions,
  replyingToId,
  replyText,
  isReplySubmitting,
  onCommentTextChange,
  onSubmitComment,
  onDeleteComment,
  onCommentReactionClick,
  onReplyTextChange,
  onStartReply,
  onCancelReply,
  onSubmitReply,
  formatDate,
}: CommentsCardProps) {
  return (
    <div className="bg-[#FFB5D5] border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💬</span>
        <h3 className="text-xl font-black text-black">Comments</h3>
        <span className="ml-auto text-lg font-black text-black">
          {comments.length}
        </span>
      </div>

      <div className="mb-4">
        <Textarea
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          placeholder="Drop your best comment (be kind) ..."
          className="border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none bg-white"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              onSubmitComment();
            }
          }}
        />
        <Button
          onClick={onSubmitComment}
          disabled={isSubmitting || !commentText.trim()}
          className="mt-2 w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold bg-[#FF9B7C]"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              userId={userId}
              commentReactionEmojis={commentReactionEmojis}
              userCommentReactions={userCommentReactions}
              replyingToId={replyingToId}
              replyText={replyText}
              isReplySubmitting={isReplySubmitting}
              onDeleteComment={onDeleteComment}
              onCommentReactionClick={onCommentReactionClick}
              onReplyTextChange={onReplyTextChange}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              formatDate={formatDate}
            />
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-8 text-black/60">
            No comments yet. Be the first! 🚀
          </div>
        )}
      </div>
    </div>
  );
}

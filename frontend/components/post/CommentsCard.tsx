"use client";

import { CommentsCardProps } from "@/types/types";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CommentsCard({
  comments,
  commentText,
  isSubmitting,
  userId,
  commentReactionEmojis,
  userCommentReactions,
  onCommentTextChange,
  onSubmitComment,
  onDeleteComment,
  onCommentReactionClick,
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
        />
        <Button
          onClick={onSubmitComment}
          disabled={isSubmitting || !commentText.trim()}
          className="mt-2 w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold bg-[#FF9B7C]"
        >
          Post
        </Button>
      </div>

      <div className="space-y-3 max-h-125 overflow-y-auto">
        <AnimatePresence>
          {comments.map((comment) => {
            const userReaction = userCommentReactions[comment._id];

            return (
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
                  {userId &&
                    typeof comment.authorId !== "string" &&
                    comment.authorId._id === userId && (
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

                <div className="flex items-center gap-2">
                  {(
                    Object.entries(commentReactionEmojis) as [
                      "like" | "love",
                      string,
                    ][]
                  ).map(([type, emoji]) => {
                    const isSelected = userReaction === type;
                    return (
                      <button
                        key={type}
                        onClick={() =>
                          onCommentReactionClick(comment._id, type)
                        }
                        className={`flex items-center gap-1 border-2 border-black rounded-full px-2 py-1 hover:scale-110 transition-all ${
                          isSelected
                            ? "bg-[#FF9B7C] scale-105"
                            : "bg-background/50"
                        }`}
                      >
                        <span className="text-sm">{emoji}</span>
                        <span className="text-xs font-bold text-black">
                          {comment.reactionCount?.[type] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
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

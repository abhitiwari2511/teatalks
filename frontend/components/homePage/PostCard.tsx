"use client";

import { Post } from "@/types/types";
import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useReactions } from "@/hooks/useReactions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: Post;
  index: number;
  onCommentClick?: (postId: string) => void;
}

const reactionEmojis = {
  like: "👍",
  love: "💝",
  funny: "😂",
  angry: "😡",
};

export default function PostCard({
  post,
  index,
  onCommentClick,
}: PostCardProps) {
  const { togglePostReaction } = useReactions();
  const router = useRouter();
  const [localReactionCount, setLocalReactionCount] = useState(
    post.reactionCount,
  );
  const [isReacting, setIsReacting] = useState(false);

  const formatDate = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? "just now" : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "1 day ago";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return postDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          postDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const handleReactionClick = async (
    reactionType: keyof typeof reactionEmojis,
  ) => {
    if (isReacting) return;

    setIsReacting(true);
    try {
      await togglePostReaction(post._id, reactionType);

      setLocalReactionCount((prev) => {
        if (!prev)
          return { like: 0, love: 0, funny: 0, angry: 0, [reactionType]: 1 };

        const newCount = { ...prev };
        // agr count > 0 to decrement nhi to increment
        if (newCount[reactionType] > 0) {
          newCount[reactionType] = Math.max(0, newCount[reactionType] - 1);
        } else {
          newCount[reactionType] = (newCount[reactionType] || 0) + 1;
        }
        return newCount;
      });
    } catch (error) {
      console.error("Error toggling reaction:", error);
    } finally {
      setIsReacting(false);
    }
  };

  const handleUsernameClick = () => {
    if (typeof post.authorId !== "string") {
      router.push(`/profile/${post.authorId.userName}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={handleUsernameClick} className="hover:underline">
            <div className="font-semibold text-foreground">
              @
              {typeof post.authorId === "string"
                ? "Unknown"
                : post.authorId.userName}
            </div>
          </button>
          <div className="text-sm text-muted-foreground font-normal">
            {formatDate(post.createdAt)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {post.title}
        </h3>
        <p className="text-foreground font-normal whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {localReactionCount &&
        Object.values(localReactionCount).some((count) => count > 0) && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {(
              Object.entries(localReactionCount) as [
                keyof typeof reactionEmojis,
                number,
              ][]
            ).map(
              ([type, count]) =>
                count > 0 && (
                  <button
                    key={type}
                    onClick={() => handleReactionClick(type)}
                    disabled={isReacting}
                    className="text-lg bg-background border-2 border-border rounded-full px-3 py-1 hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    {reactionEmojis[type]} {count}
                  </button>
                ),
            )}
          </div>
        )}

      <div className="flex items-center gap-3 pt-4 border-t-4 border-border flex-wrap">
        <div className="flex items-center gap-2">
          {(
            Object.entries(reactionEmojis) as [
              keyof typeof reactionEmojis,
              string,
            ][]
          ).map(([type, emoji]) => (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              disabled={isReacting}
              className="text-2xl hover:scale-125 transition-transform disabled:opacity-50 p-1"
              title={type}
            >
              {emoji}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onCommentClick?.(post._id)}
          className="border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          {post.commentCount || 0}
        </Button>
      </div>
    </motion.div>
  );
}

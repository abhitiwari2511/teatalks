import { Post } from "@/types/types";
import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { Button } from "../ui/button";

interface ProfilePostCardProps {
  post: Post;
  index: number;
}

export default function ProfilePostCard({ post, index }: ProfilePostCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all mb-4"
    >
      {/* header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-muted-foreground font-normal">
          {formatDate(post.createdAt)}
        </div>
      </div>

      {/* content */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {post.title}
        </h3>
        <p className="text-foreground font-normal">{post.content}</p>
      </div>

      {/* Reactions Preview */}
      {post.reactionCount &&
        (post.reactionCount.like > 0 ||
          post.reactionCount.love > 0 ||
          post.reactionCount.funny > 0 ||
          post.reactionCount.angry > 0) && (
          <div className="flex items-center gap-2 mb-4">
            {post.reactionCount.like > 0 && (
              <span className="text-xl bg-background border-2 border-border rounded-full px-3 py-1">
                👍 {post.reactionCount.like}
              </span>
            )}
            {post.reactionCount.love > 0 && (
              <span className="text-xl bg-background border-2 border-border rounded-full px-3 py-1">
                ❤️ {post.reactionCount.love}
              </span>
            )}
            {post.reactionCount.funny > 0 && (
              <span className="text-xl bg-background border-2 border-border rounded-full px-3 py-1">
                😂 {post.reactionCount.funny}
              </span>
            )}
            {post.reactionCount.angry > 0 && (
              <span className="text-xl bg-background border-2 border-border rounded-full px-3 py-1">
                😡 {post.reactionCount.angry}
              </span>
            )}
          </div>
        )}

      <div className="flex items-center gap-4 pt-4 border-t-4 border-border">
        <Button
          variant="outline"
          size="sm"
          className="border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          {post.commentCount || 0}
        </Button>
      </div>
    </motion.div>
  );
}

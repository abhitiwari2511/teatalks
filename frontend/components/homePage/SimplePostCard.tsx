"use client";

import { Post } from "@/types/types";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

interface SimplePostCardProps {
  post: Post;
  index: number;
}

const colors = [
  "bg-[#FFB5D5]", // pink
  "bg-[#FF9B7C]", // coral
  "bg-[#FFF8DC]", // cream
  "bg-[#B4E7E7]", // teal
];

export default function SimplePostCard({ post, index }: SimplePostCardProps) {
  const router = useRouter();
  const bgColor = colors[index % colors.length];

  const formatDate = (dateString: string) => {
    const postDate = new Date(dateString);
    return postDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCardClick = () => {
    router.push(`/post/${post._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleCardClick}
      className={`${bgColor} border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer`}
    >
      {/* Username and date */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-black">
          @
          {typeof post.authorId === "string"
            ? "Unknown"
            : post.authorId.userName}
        </div>
        <div className="text-sm text-black/70 font-normal">
          {formatDate(post.createdAt)}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-black text-black mb-2 wrap-break-word">
        {post.title}
      </h3>

      {/* Content */}
      <p className="text-black font-normal line-clamp-3 whitespace-pre-wrap wrap-break-word">
        {post.content}
      </p>

      {/* Stats footer */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t-2 border-black/20">
        <div className="text-sm font-semibold text-black">
          👍{" "}
          {(post.reactionCount?.like || 0) +
            (post.reactionCount?.love || 0) +
            (post.reactionCount?.funny || 0) +
            (post.reactionCount?.angry || 0)}
        </div>
        <div className="text-sm font-semibold text-black">
          💬 {post.commentCount || 0}
        </div>
      </div>
    </motion.div>
  );
}

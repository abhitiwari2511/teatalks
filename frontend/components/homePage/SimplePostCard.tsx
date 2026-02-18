"use client";

import { Post } from "@/types/types";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { useState } from "react";

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
  const { user, loading: authLoading } = useAuth();
  const { deleteUserPost } = usePosts();
  const [isDeleting, setIsDeleting] = useState(false);
  const bgColor = colors[index % colors.length];

  // Only check ownership after auth has loaded
  const isOwnPost =
    !authLoading &&
    user &&
    typeof post.authorId !== "string" &&
    post.authorId._id === user._id;

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      try {
        await deleteUserPost(post._id);
        // Reload to show updated posts
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete post:", error);
        setIsDeleting(false);
      }
    }
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
        <div className="font-normal text-black">
          @
          {typeof post.authorId === "string"
            ? "Unknown"
            : post.authorId.userName}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-black/70 font-normal">
            {formatDate(post.createdAt)}
          </div>
          {isOwnPost ? (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-black/60 cursor-pointer hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div style={{ width: "16px" }} /> 
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-normal text-black mb-2">
        {post.title}
      </h3>

      {/* Content */}
      <p className="text-black font-extralight">
        {post.content}
      </p>

      {/* Stats footer */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t-2 border-black/20">
        <div className="text-sm font-semibold text-black">
          ❤️{" "}
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

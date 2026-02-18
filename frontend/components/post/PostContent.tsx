"use client";

import { Post as PostType } from "@/types/types";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

interface PostContentProps {
  post: PostType;
  formatDate: (date: string) => string;
  userId?: string;
  onDeletePost?: (postId: string) => Promise<boolean>;
}

export default function PostContent({
  post,
  formatDate,
  userId,
  onDeletePost,
}: PostContentProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUsernameClick = () => {
    if (typeof post.authorId !== "string") {
      router.push(`/profile/${post.authorId.userName}`);
    }
  };

  const handleDelete = async () => {
    if (!onDeletePost) return;

    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      const success = await onDeletePost(post._id);
      if (success) {
        router.push("/home");
      } else {
        setIsDeleting(false);
      }
    }
  };

  const isOwnPost =
    userId && typeof post.authorId !== "string" && post.authorId._id === userId;
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="border-4 cursor-pointer border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Post content */}
      <div className="bg-[#FFF8DC] border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Author info */}
        <div className="flex items-center justify-between mb-4">
          <div
            onClick={handleUsernameClick}
            className="cursor-pointer hover:underline"
          >
            <div className="text-2xl font-normal text-black">
              @
              {typeof post.authorId === "string"
                ? "Unknown"
                : post.authorId.userName}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-black/70 font-normal">
              📅 {formatDate(post.createdAt)}
            </div>
            {isOwnPost && onDeletePost && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-black/60 cursor-pointer hover:text-red-600 transition-colors disabled:opacity-50"
                title="Delete post"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-blue-700 mb-4">
          {post.title}
        </h1>

        {/* Content */}
        <div className="text-red-600 font-normal text-lg">
          {post.content}
        </div>
      </div>
    </div>
  );
}

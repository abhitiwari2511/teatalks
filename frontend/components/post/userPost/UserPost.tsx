"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePostPage } from "@/hooks/usePostPage";
import Header from "@/components/homePage/Header";
import PostContent from "@/components/post/PostContent";
import ReactionCard from "@/components/post/ReactionCard";
import CommentsCard from "@/components/post/CommentsCard";
import { motion } from "motion/react";

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

const formatDate = (dateString: string) => {
  const postDate = new Date(dateString);
  return postDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const UserPost = () => {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const {
    post,
    comments,
    loading,
    commentText,
    isSubmitting,
    userReaction,
    userCommentReactions,
    localReactionCount,
    setCommentText,
    handleReactionClick,
    handleCommentReactionClick,
    handleSubmitComment,
    handleDeleteComment,
    handleDeletePost,
  } = usePostPage(postId, user?._id);

  if (loading || authLoading) {
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
            <button
              onClick={() => router.push("/home")}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Go back home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <PostContent
              post={post}
              formatDate={formatDate}
              userId={user?._id}
              onDeletePost={handleDeletePost}
            />
          </motion.div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ReactionCard
                reactionEmojis={reactionEmojis}
                localReactionCount={localReactionCount}
                userReaction={userReaction}
                onReactionClick={handleReactionClick}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CommentsCard
                comments={comments}
                commentText={commentText}
                isSubmitting={isSubmitting}
                userId={user?._id}
                commentReactionEmojis={commentReactionEmojis}
                userCommentReactions={userCommentReactions}
                onCommentTextChange={setCommentText}
                onSubmitComment={handleSubmitComment}
                onDeleteComment={handleDeleteComment}
                onCommentReactionClick={handleCommentReactionClick}
                formatDate={formatDate}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPost;

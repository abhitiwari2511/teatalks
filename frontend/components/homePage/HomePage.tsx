"use client";

import { motion } from "motion/react";
import { useEffect } from "react";
import { HomePageForm } from "../ClientSideForms";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import Header from "./Header";
import SimplePostCard from "./SimplePostCard";

export default function HomePage() {
  const { posts, loading, error, fetchPosts } = usePosts();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchPosts();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen mx-auto bg-background dark">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        {(loading || authLoading) && (
          <div className="text-center py-8">
            <p className="text-muted-foreground italic">Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border-4 border-destructive text-destructive rounded-2xl p-4 italic mb-4">
            {error}
          </div>
        )}

        {!loading && !authLoading && !error && posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground italic">
              No posts yet. Be the first! 🚀
            </p>
          </div>
        )}

        <div className="grid max-w-4xl mx-auto grid-cols-1 lg:grid-cols-3 gap-6">
          {/* main feed */}
          <div className="lg:col-span-2 space-y-6">
            <HomePageForm />

            <div className="space-y-6">
              {!loading &&
                !authLoading &&
                !error &&
                posts.length > 0 &&
                posts.map((post, index) => (
                  <SimplePostCard key={post._id} post={post} index={index} />
                ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-400 border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1"
            >
              <h3 className="text-xl font-normal text-foreground mb-3">
                You&apos;re All Doing Great! 🎉
              </h3>
              <div className="space-y-2 text-foreground">
                <p className="font-normal">📝 {posts.length} posts this week</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

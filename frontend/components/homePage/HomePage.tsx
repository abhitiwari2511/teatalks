"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  MessageSquare,
  Flame,
  ArrowBigUp,
  ArrowBigDown,
  Search,
  Bell,
  User,
  Share2,
} from "lucide-react";
import { HomeSearchButton, HomeTabsButton } from "../ClientSideButtons";
import { HomePageForm } from "../ClientSideForms";

export default function HomePage() {
  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "priya_codes",
      avatar: "🧑‍💻",
      time: "2h ago",
      title: "Just found out our CS prof postponed the exam!",
      content:
        "Finally some good news this semester 😭 Anyone else celebrating?",
      upvotes: 234,
      comments: 45,
      reactions: ["🎉", "😭", "🔥"],
    },
    {
      id: 2,
      author: "campus_gossip",
      avatar: "👀",
      time: "4h ago",
      title: "New cafe opening next to library tomorrow",
      content:
        "Finally a decent place for coffee that's not overpriced! They're giving 50% off on opening day 👀",
      upvotes: 189,
      comments: 32,
      reactions: ["☕", "🎉", "😍"],
    },
    {
      id: 3,
      author: "meme_lord_420",
      avatar: "😎",
      time: "6h ago",
      title: "When the prof says 'this will be on the exam'",
      content:
        "*insert panic meme* But seriously, anyone got notes from last week's lecture?",
      upvotes: 567,
      comments: 89,
      reactions: ["😂", "💀", "📝"],
    },
  ]);

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b-4 border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-2xl">☕</span>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">
                  TeaTalks
                </h1>
                <p className="text-xs text-muted-foreground -mt-1 font-normal">
                  spill the tea
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search posts, users..."
                  className="w-full px-4 py-2 pl-10 border-4 border-border rounded-full bg-input font-normal focus:outline-none focus:ring-4 focus:ring-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="border-4 border-border rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-4 border-border rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <User className="w-5 h-5" />
              </Button>
              <HomeSearchButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <HomeTabsButton />

            {/* Create Post Button */}
            <HomePageForm />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-full border-4 border-border flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="font-normal text-foreground">
                          @{post.author}
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {post.time}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-normal text-foreground mb-2">
                      {post.title}
                    </h3>
                    <p className="text-foreground font-normal">
                      {post.content}
                    </p>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center gap-2 mb-4">
                    {post.reactions.map((reaction, i) => (
                      <span
                        key={i}
                        className="text-xl bg-background border-3 border-border rounded-full px-3 py-1"
                      >
                        {reaction}
                      </span>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t-4 border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <ArrowBigUp className="w-4 h-4 mr-1" />
                        {post.upvotes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-4 border-border rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <ArrowBigDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-4 border-border rounded-full font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="text-xl font-normal text-foreground mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {[
                  { tag: "#ExamPostponed", posts: "234 posts" },
                  { tag: "#CampusFest2026", posts: "189 posts" },
                  { tag: "#HostelLife", posts: "156 posts" },
                  { tag: "#PlacementSeason", posts: "142 posts" },
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background border-3 border-border rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="font-normal text-foreground">
                      {topic.tag}
                    </div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {topic.posts}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Campus Communities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <h3 className="text-xl font-normal text-foreground mb-4">
                Communities
              </h3>
              <div className="space-y-3">
                {[
                  { name: "CS Nerds", icon: "💻", members: "2.3k" },
                  { name: "Meme Lords", icon: "😂", members: "1.8k" },
                  { name: "Study Group", icon: "📚", members: "1.5k" },
                  { name: "Sports Squad", icon: "⚽", members: "1.2k" },
                ].map((community, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-background border-3 border-border rounded-xl hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{community.icon}</span>
                      <div>
                        <div className="font-normal text-foreground">
                          {community.name}
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {community.members} members
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-3 border-border rounded-full font-normal text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-accent border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1"
            >
              <h3 className="text-xl font-normal text-foreground mb-3">
                You&apos;re doing great! 🎉
              </h3>
              <div className="space-y-2 text-foreground">
                <p className="font-normal">📝 12 posts this week</p>
                <p className="font-normal">💬 45 comments</p>
                <p className="font-normal">⬆️ 234 upvotes received</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flame,
  LogOut,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useState } from "react";

const NavRegisterButton = () => {
  const router = useRouter();

  return (
    <div className="space-x-3">
      <Button
        variant="default"
        onClick={() => router.push("/login")}
        className="border-4 bg-pink-200 text-foreground border-border font-normal rounded-full px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-200 transition-all"
      >
        SIGN IN
      </Button>
      <Button
        onClick={() => router.push("/register")}
        className="bg-accent text-foreground border-4 font-normal border-border rounded-full px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-accent"
      >
        GET STARTED
      </Button>
    </div>
  );
};

const HeroRegisterButton = () => {
  const router = useRouter();

  return (
    <Button
      size="lg"
      onClick={() => router.push("/register")}
      className="bg-primary text-primary-foreground border-4 border-border rounded-full px-8 py-6 text-lg font-normal shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-primary group"
    >
      JOIN NOW
      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
};

const CtaRegisterButton = () => {
  const router = useRouter();

  return (
    <Button
      size="lg"
      onClick={() => router.push("/register")}
      className="bg-accent text-foreground border-4 border-border rounded-full px-8 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-accent"
    >
      LET&apos;S GO! 🚀
    </Button>
  );
};

const LoginRegisterButton = () => {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-14 bg-accent text-foreground border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-lg italic hover:bg-accent"
      onClick={() => router.push("/register")}
    >
      Create Account
    </Button>
  );
};

const LoginBackButton = () => {
  const router = useRouter();
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => router.push("/")}
      className="fixed top-6 left-6 flex items-center gap-2 text-foreground hover:-translate-x-0.5 transition-transform z-50 bg-card border-4 border-border rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="italic">Back</span>
    </motion.button>
  );
};

const SignUpBackButton = () => {
  const router = useRouter();
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => router.push("/")}
      className="fixed top-6 left-6 flex items-center gap-2 text-foreground hover:-translate-x-0.5 transition-transform z-50 bg-card border-4 border-border rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="italic">Back</span>
    </motion.button>
  );
};

const SignInButton = () => {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-12 bg-secondary text-foreground border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all italic hover:bg-secondary"
      onClick={() => router.push("/login")}
    >
      Sign In
    </Button>
  );
};

const HomeSearchButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/")}
      variant="outline"
      size="icon"
      className="border-4 border-border rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      <LogOut className="w-5 h-5" />
    </Button>
  );
};

const HomeTabsButton = () => {
  const [activeTab, setActiveTab] = useState("hot");
  const tabs = [
    { id: "hot", label: "🔥 Hot", icon: Flame },
    { id: "new", label: "⚡ New", icon: Clock },
    { id: "top", label: "📈 Top", icon: TrendingUp },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 border-4 border-border rounded-full font-normal transition-all ${
            activeTab === tab.id
              ? "bg-accent text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              : "bg-card text-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const HomeCreatePostButton = ({ onClick, isOpen }: { onClick?: () => void; isOpen?: boolean }) => {
  return (
    <Button
      onClick={onClick}
      className="w-full bg-primary text-primary-foreground border-4 border-border rounded-2xl py-6 text-lg font-normal shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-primary"
    >
      <Plus className="w-5 h-5 mr-2" />
      {isOpen ? "Cancel" : "Create Post"}
    </Button>
  );
};

const HomeCancelButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="border-4 border-border rounded-full px-6 font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      Cancel
    </Button>
  );
};

export {
  CtaRegisterButton,
  HeroRegisterButton,
  NavRegisterButton,
  LoginRegisterButton,
  LoginBackButton,
  SignUpBackButton,
  SignInButton,
  HomeSearchButton,
  HomeTabsButton,
  HomeCreatePostButton,
  HomeCancelButton,
};

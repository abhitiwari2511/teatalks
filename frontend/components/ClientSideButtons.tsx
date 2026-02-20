"use client";

import { ArrowLeft, ArrowRight, LogOut, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";

const NavRegisterButton = () => {
  const router = useRouter();

  return (
    <div className="space-x-3 flex items-center justify-center">
      <Button
        variant="default"
        onClick={() => router.push("/login")}
        className="border-4 cursor-pointer bg-green-400 text-foreground border-border font-normal rounded-full sm:px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-400 transition-all"
      >
        SIGN IN
      </Button>
      <Button
        onClick={() => router.push("/register")}
        className="bg-accent cursor-pointer text-foreground border-4 font-normal border-border rounded-full sm:px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-accent"
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
      className="bg-green-400 cursor-pointer text-primary border-4 border-border rounded-full px-8 py-6 text-lg font-normal shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-green-400"
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
      className="bg-green-400 cursor-pointer text-foreground border-4 border-border rounded-full px-8 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-green-400"
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
      variant="default"
      className="w-full h-14 cursor-pointer bg-secondary text-foreground border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-lg italic hover:bg-secondary"
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
      className="fixed top-6 cursor-pointer left-6 flex items-center gap-2 text-foreground hover:-translate-x-0.5 transition-transform z-50 bg-card border-4 border-border rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
      className="fixed top-6 cursor-pointer left-6 flex items-center gap-2 text-foreground hover:-translate-x-0.5 transition-transform z-50 bg-card border-4 border-border rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
      variant="default"
      className="w-full h-12 cursor-pointer bg-secondary text-foreground border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all italic hover:bg-secondary"
      onClick={() => router.push("/login")}
    >
      Sign In
    </Button>
  );
};

const HomeLogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        logout();
        router.push("/");
      }}
      variant="default"
      size="icon"
      className="border-4 bg-red-400 cursor-pointer border-none rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-400 transition-all"
    >
      <LogOut className="w-5 text-primary h-5" />
    </Button>
  );
};

const UserProfileButton = () => {
  const { user } = useAuth();
  const router = useRouter();
  const handleProfileClick = () => {
    if (user?.userName) {
      router.push(`/profile/${user.userName}`);
    }
  };
  return (
    <Button
      onClick={handleProfileClick}
      variant="default"
      size="icon"
      className="border-4 cursor-pointer bg-cyan-500 border-none rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-500 transition-all"
    >
      <User className="w-5 h-5 text-primary" />
    </Button>
  );
};

const HomeCreatePostButton = ({
  onClick,
  isOpen,
}: {
  onClick?: () => void;
  isOpen?: boolean;
}) => {
  return (
    <Button
      onClick={onClick}
      className="w-full cursor-pointer bg-blue-800 text-primary-foreground border-4 border-border rounded-2xl py-6 text-lg font-normal shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-blue-800"
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
      className="border-4 cursor-pointer border-border rounded-full px-6 font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      Cancel
    </Button>
  );
};

export {
  UserProfileButton,
  CtaRegisterButton,
  HeroRegisterButton,
  NavRegisterButton,
  LoginRegisterButton,
  LoginBackButton,
  SignUpBackButton,
  SignInButton,
  HomeLogoutButton,
  HomeCreatePostButton,
  HomeCancelButton,
};

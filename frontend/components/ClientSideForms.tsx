"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "./ui/label";
import { Lock, Mail, Send, ShieldCheck, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import {
  HomeCancelButton,
  HomeCreatePostButton,
  SignInButton,
} from "./ClientSideButtons";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";

const LoginForm = () => {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push("/home");
    } catch (error: unknown) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border-4 border-destructive text-destructive rounded-2xl p-4 italic">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground italic">
          College Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            disabled={loading}
            placeholder="you@hmritm.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 h-14 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground italic">
            Password
          </Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            disabled={loading}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 h-14 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer h-14 bg-green-400 text-primary border-4 border-border rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-lg italic hover:bg-green-400"
      >
        {loading ? "Logging in..." : "LET'S GO! 🚀"}
      </Button>
    </form>
  );
};

const SignUpForm = () => {
  const router = useRouter();
  const { register, loading, error, verifyOTP, resendOTP } = useAuth();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.endsWith("@hmritm.ac.in")) {
      alert("Please use your college email (@hmritm.ac.in)");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        userName: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setStep("otp");
    } catch (error: unknown) {
      console.error("Error during registration:", error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP({ email: formData.email, otp });
      router.push("/home");
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email: formData.email });
    } catch (error: unknown) {
      console.error("Failed to resend OTP:", error);
    }
  };
  return (
    <div>
      {" "}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            rotate: step === "details" ? [0, -10, 10, 0] : 0,
          }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-20 h-20 bg-accent rounded-full border-4 border-border flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-4xl"
        >
          {step === "details" ? "🎓" : "✉️"}
        </motion.div>
        <h1 className="text-4xl mb-2 text-foreground italic">
          {step === "details" ? "Join the Circle!" : "Check Your Email"}
        </h1>
        <p className="text-muted-foreground">
          {step === "details"
            ? "Let's get you set up in 2 mins"
            : `We sent a code to ${formData.email}`}
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className={`w-12 h-12 rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            step === "details"
              ? "bg-primary text-primary-foreground"
              : "bg-white text-foreground"
          }`}
        >
          1
        </div>
        <div className="w-12 h-1 bg-border" />
        <div
          className={`w-12 h-12 rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            step === "otp"
              ? "bg-primary text-primary-foreground"
              : "bg-white text-foreground"
          }`}
        >
          2
        </div>
      </div>
      {step === "details" ? (
        <form onSubmit={handleSubmitDetails} className="space-y-5">
          {error && (
            <div className="bg-destructive/10 border-4 border-destructive text-destructive rounded-2xl p-4 italic">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground italic">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                disabled={loading}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="pl-12 h-14 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground italic">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                disabled={loading}
                placeholder="coolstudent123"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="pl-12 h-14 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground italic">
              College Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                disabled={loading}
                placeholder="you@hmritm.ac.in"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-12 h-14 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
                required
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
              <ShieldCheck className="w-4 h-4" />
              <span>Only @hmritm.ac.in emails allowed</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground italic">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                disabled={loading}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-12 h-14 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer h-14 bg-green-400 text-primary border-4 border-border rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-lg italic hover:bg-green-400 mt-2"
          >
            {loading ? "SENDING OTP..." : "CONTINUE →"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border-4 border-destructive text-destructive rounded-2xl p-4 italic">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="otp"
              className="text-foreground text-center block italic"
            >
              Enter 6-Digit Code
            </Label>
            <Input
              id="otp"
              type="text"
              disabled={loading}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-3xl tracking-widest h-16 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
              maxLength={6}
              required
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-green-400 text-primary border-4 border-border rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-lg italic hover:bg-green-400"
            >
              {loading ? "VERIFYING..." : "VERIFY & JOIN! 🎉"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              className="w-full text-muted-foreground hover:text-foreground italic underline"
              onClick={handleResendOTP}
            >
              Didn&apos;t get it? Resend code
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all italic hover:bg-white"
            onClick={() => setStep("details")}
          >
            ← Back
          </Button>
        </form>
      )}
      {step === "details" && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-border border-dashed" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-muted-foreground italic">
                Already in?
              </span>
            </div>
          </div>

          {/* button signin */}
          <SignInButton />
        </>
      )}
    </div>
  );
};

const HomePageForm = () => {
  const { createUserPost, loading } = usePosts();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async () => {
    try {
      await createUserPost({ title: title, content: content });
      setTitle("");
      setContent("");
      setShowCreatePost(!showCreatePost);
      // Reload to show the new post with fresh data
      window.location.reload();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <HomeCreatePostButton
          onClick={() => setShowCreatePost(!showCreatePost)}
          isOpen={showCreatePost}
        />
      </motion.div>

      {/* Create Post Form */}
      {showCreatePost && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card mt-5 border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <h3 className="text-xl font-normal text-foreground mb-4">
            What&apos;s on your mind?
          </h3>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tea title..."
            className="border-4 border-border rounded-xl mb-4 font-normal min-h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Spill the tea... (Be respectful though!)"
            className="border-4 border-border rounded-xl mb-4 font-normal min-h-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
          />
          <div className="flex gap-3 justify-end">
            <HomeCancelButton onClick={() => setShowCreatePost(false)} />
            <Button
              onClick={handleCreatePost}
              disabled={loading || title.trim() === "" || content.trim() === ""}
              className="bg-accent text-foreground border-4 border-border rounded-full px-6 font-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-accent"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export { LoginForm, SignUpForm, HomePageForm };

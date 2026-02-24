"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "../ui/label";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { forgotPassword, resetPassword, loading, error } = useAuth();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    try {
      await forgotPassword(email);
      setStep("reset");
    } catch (error: unknown) {
      console.error("Failed to send OTP:", error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword });
      setSuccessMessage("Password reset successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      console.error("Password reset failed:", error);
    }
  };

  const handleResendCode = async () => {
    try {
      await forgotPassword(email);
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            rotate: step === "email" ? [0, -10, 10, 0] : 0,
          }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-20 h-20 bg-[#FFE66D] rounded-full border-4 border-border flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-4xl"
        >
          {step === "email" ? "🔑" : "✉️"}
        </motion.div>
        <h1 className="text-4xl mb-2 text-foreground italic">
          {step === "email" ? "Forgot Password?" : "Check Your Email"}
        </h1>
        <p className="text-muted-foreground">
          {step === "email"
            ? "No worries, we'll send you a reset code"
            : `We sent a code to ${email}`}
        </p>
      </div>

      {/* steps number */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className={`w-12 h-12 rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            step === "email"
              ? "bg-accent text-primary"
              : "bg-white text-foreground"
          }`}
        >
          1
        </div>
        <div className="w-12 h-1 bg-border" />
        <div
          className={`w-12 h-12 rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            step === "reset"
              ? "bg-accent text-primary"
              : "bg-white text-foreground"
          }`}
        >
          2
        </div>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
              <ShieldCheck className="w-4 h-4" />
              <span>Only @hmritm.ac.in emails allowed</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer h-14 bg-green-400 text-primary border-4 border-border rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-lg italic hover:bg-green-400"
          >
            {loading ? "SENDING OTP..." : "SEND RESET CODE →"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border-4 border-destructive text-destructive rounded-2xl p-4 italic">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border-4 border-green-500 text-green-700 rounded-2xl p-4 italic">
              {successMessage}
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

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-foreground italic">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                disabled={loading}
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-12 h-14 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading || !!successMessage}
              className="w-full h-14 bg-green-400 text-primary border-4 border-border rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-lg italic hover:bg-green-400"
            >
              {loading ? "RESETTING..." : "RESET PASSWORD 🔒"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              className="w-full text-muted-foreground hover:text-foreground italic underline"
              onClick={handleResendCode}
            >
              Didn&apos;t get it? Resend code
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-white border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all italic hover:bg-white"
            onClick={() => setStep("email")}
          >
            ← Back
          </Button>
        </form>
      )}

      {step === "email" && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-border border-dashed" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-muted-foreground italic">
                Remember it?
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            className="w-full h-12 cursor-pointer bg-secondary text-foreground border-4 border-border rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all italic hover:bg-secondary"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;

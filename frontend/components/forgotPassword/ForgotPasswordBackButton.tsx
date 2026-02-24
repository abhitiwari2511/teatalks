"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

const ForgotPasswordBackButton = () => {
  const router = useRouter();
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => router.push("/login")}
      className="fixed top-6 cursor-pointer left-6 flex items-center gap-2 text-foreground hover:-translate-x-0.5 transition-transform z-50 bg-card border-4 border-border rounded-full px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="italic">Back</span>
    </motion.button>
  );
};

export { ForgotPasswordBackButton };

import * as motion from "motion/react-client";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { ForgotPasswordBackButton } from "./ForgotPasswordBackButton";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4 relative">
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#FFE66D] rounded-full border-4 border-border opacity-50" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary rounded-full border-4 border-border opacity-50" />
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-accent border-4 border-border rotate-45 opacity-50" />

      <ForgotPasswordBackButton />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border-4 border-border rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <ForgotPasswordForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 italic">
          Protected by college email verification 🔒
        </p>
      </motion.div>
    </div>
  );
}

import * as motion from "motion/react-client";
import { SignUpBackButton } from "../ClientSideButtons";
import { SignUpForm } from "../ClientSideForms";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4 relative">
      <div className="absolute top-10 right-10 w-24 h-24 bg-[#FFE66D] border-4 border-border rotate-12 opacity-50" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-secondary rounded-full border-4 border-border opacity-50" />
      <div className="absolute top-1/3 left-20 w-20 h-20 bg-accent border-4 border-border rotate-[-15deg] opacity-50" />

      {/* Back button */}
      <SignUpBackButton />

      {/* Register Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border-4 border-border rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <SignUpForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 italic">
          By joining, you agree to keep it cool & respectful ✌️
        </p>
      </motion.div>
    </div>
  );
}

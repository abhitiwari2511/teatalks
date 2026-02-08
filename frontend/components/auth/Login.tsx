import * as motion from "motion/react-client";
import { LoginBackButton, LoginRegisterButton } from "../ClientSideButtons";
import { LoginForm } from "../ClientSideForms";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center p-4 relative">
      <div className="absolute top-10 left-10 w-20 h-20 bg-secondary rounded-full border-4 border-border opacity-50" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent rounded-full border-4 border-border opacity-50" />
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-[#FFE66D] border-4 border-border rotate-45 opacity-50" />

      <LoginBackButton />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border-4 border-border rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 bg-secondary rounded-full border-4 border-border flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-4xl"
            >
              👋
            </motion.div>
            <h1 className="text-4xl mb-2 text-foreground italic">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground">
              Time to catch up on campus chaos
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-border border-dashed" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-muted-foreground italic">
                New here?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <LoginRegisterButton />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 italic">
          Protected by college email verification 🔒
        </p>
      </motion.div>
    </div>
  );
}

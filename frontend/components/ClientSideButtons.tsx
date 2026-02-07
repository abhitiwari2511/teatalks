"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

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

export { CtaRegisterButton, HeroRegisterButton, NavRegisterButton };

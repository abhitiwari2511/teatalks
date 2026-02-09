import { Flame } from "lucide-react";
import * as motion from "motion/react-client"; 
import { HeroRegisterButton } from "../ClientSideButtons";

const Hero = () => {
  return <div>
    <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-block bg-secondary border-4 border-border rounded-full px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
              <span className="text-sm text-foreground italic flex items-center gap-2">
                <Flame className="w-4 h-4" />
                2000+ students already vibing
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-normal mb-6 text-foreground leading-tight tracking-tight"
          >
            Your Campus,
            <br />
            <span className="inline-block bg-accent border-4 border-border px-6 py-2 -rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              Uncensored
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-normal text-foreground mb-8 max-w-2xl mx-auto"
          >
            Say goodbye to 47 WhatsApp groups. This is THE place for campus
            chaos, study groups, and everything in between.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <HeroRegisterButton />
            <span className="text-sm text-muted-foreground font-normal">
              (it&apos;s free, duh)
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {[
              { value: "2K+", label: "Students" },
              { value: "500+", label: "Daily Posts" },
              { value: "50+", label: "Communities" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card border-4 border-border rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-rotate-2 transition-transform"
              >
                <div className="text-3xl font-black text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-normal">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
  </div>;
};

export default Hero;

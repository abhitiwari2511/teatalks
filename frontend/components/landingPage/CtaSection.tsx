import { Star, TrendingUp } from "lucide-react";
import * as motion from "motion/react-client";
import { CtaRegisterButton } from "../ClientSideButtons";

const CtaSection = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-secondary text-primary-foreground border-4 border-border rounded-3xl p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          <div className="absolute top-4 right-4">
            <Star className="w-12 h-12 text-primary fill-accent animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4">
            <TrendingUp className="w-12 h-12 text-primary" />
          </div>

          <h2 className="text-4xl md:text-5xl text-primary mb-6 italic">
            Ready to Stop Missing Out?
          </h2>
          <p className="text-xl text-primary mb-8 opacity-90">
            Your college email is the golden ticket. Join in 2 minutes and
            never feel FOMO again.
          </p>
          <CtaRegisterButton />
        </motion.div>
      </div>
    </div>
  );
};

export default CtaSection;

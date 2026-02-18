import * as motion from "motion/react-client";
import { NavRegisterButton } from "../ClientSideButtons";

const Navbar = () => {
  return (
    <div className="border-b-4 border-border bg-card">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center select-none justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer gap-3"
          >
            <div className="w-12 h-12 bg-secondary rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">☕</span>
            </div>
            <div>
              <h1 className="text-2xl text-foreground">TeaTalks</h1>
              <p className="text-xs text-muted-foreground -mt-1">
                spill the tea
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <NavRegisterButton />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

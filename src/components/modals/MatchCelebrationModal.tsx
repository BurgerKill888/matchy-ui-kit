import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MatchCelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchName: string;
  matchOwner: string;
  compatibility: number;
}

export default function MatchCelebrationModal({
  open,
  onOpenChange,
  matchName,
  matchOwner,
  compatibility,
}: MatchCelebrationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-primary/30 overflow-hidden p-0">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="relative"
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none" />
              
              {/* Sparkle particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                    initial={{
                      x: "50%",
                      y: "40%",
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: `${20 + Math.random() * 60}%`,
                      y: `${10 + Math.random() * 80}%`,
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5 + Math.random(),
                      delay: 0.2 + Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              <div className="relative flex flex-col items-center text-center p-8 pt-10">
                {/* Match icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10, delay: 0.15 }}
                  className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center mb-5 glow-gold"
                >
                  <Sparkles className="text-primary" size={36} />
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-3xl font-bold mb-1"
                >
                  <span className="text-gradient-gold">C'est un Match !</span>
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-sm mb-6"
                >
                  Vous et <span className="text-foreground font-medium">{matchOwner}</span> êtes intéressés mutuellement
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card rounded-xl p-4 w-full mb-6"
                >
                  <p className="font-display font-semibold text-sm">{matchName}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${compatibility}%` }}
                        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary">{compatibility}%</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-3 w-full"
                >
                  <Link to="/messaging" onClick={() => onOpenChange(false)}>
                    <Button className="w-full glow-gold">
                      <MessageSquare size={16} className="mr-2" /> Démarrer la conversation
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground">
                    Continuer à explorer <ArrowRight size={14} className="ml-1" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({ icon: Icon, title, subtitle, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="text-primary" size={36} />
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">{subtitle}</p>
      {ctaLabel && ctaHref && (
        <Link to={ctaHref}>
          <Button className="glow-gold">{ctaLabel}</Button>
        </Link>
      )}
    </motion.div>
  );
}

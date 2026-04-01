"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassPanelProps {
  children: React.ReactNode;
  variant?: "light" | "dark" | "archive";
  hover?: boolean;
  delay?: number;
  className?: string;
}

export default function GlassPanel({
  children,
  variant = "light",
  hover = false,
  delay = 0,
  className,
}: GlassPanelProps) {
  const variants = {
    light: "bg-white/70 backdrop-blur-xl border border-gray-200/60 shadow-lg shadow-gray-200/20",
    dark: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg",
    archive: "bg-archive-card/90 backdrop-blur-xl border border-archive-border shadow-lg",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(
        "rounded-xl p-6",
        variants[variant],
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

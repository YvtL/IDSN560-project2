"use client";

import { useSession } from "@/context/session-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navigation() {
  const { session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Hide nav on entry page — it's a social media feed
  if (pathname === "/") return null;

  const isDark = pathname === "/monitor" || pathname === "/inbox";

  const links = [
    { href: "/apply", label: "Application", always: true },
    { href: "/monitor", label: "Monitor", always: false, requires: session.applicationComplete },
    { href: "/inbox", label: "Inbox", always: false, requires: session.aiConversationComplete || session.terminalComplete },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isDark
          ? scrolled
            ? "bg-gray-950/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
          : scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm"
            : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
            isDark
              ? "bg-white/10 text-white group-hover:bg-white/15"
              : "bg-tckr-900 text-white group-hover:bg-tckr-800"
          )}>
            T
          </div>
          <span className={cn(
            "text-sm font-semibold tracking-wide",
            isDark ? "text-white/80" : "text-gray-900"
          )}>
            TCKR Systems
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            if (!link.always && !link.requires) return null;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  isDark
                    ? active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    : active
                      ? "bg-tckr-50 text-tckr-700"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <AnimatePresence>
            {session.candidateId && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "ml-3 px-2 py-1 rounded text-[10px] font-mono",
                  isDark
                    ? "bg-white/5 text-white/30"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                {session.candidateId}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
}
